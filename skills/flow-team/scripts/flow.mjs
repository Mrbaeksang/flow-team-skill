#!/usr/bin/env node
// Flow Open API client — Node 18+ (global fetch), zero dependencies.
// Auth comes from the FLOW_API_KEY environment variable. Never hardcode the key.
//
// Library usage:
//   import { flow } from "./scripts/flow.mjs";
//   const me = await flow.me();
//   const projects = await flow.myProjects();
//
// CLI usage (quick checks):
//   node scripts/flow.mjs me
//   node scripts/flow.mjs projects
//   node scripts/flow.mjs tasks <projectId>
//   node scripts/flow.mjs alarms
//   node scripts/flow.mjs events 20260601000000 20260630235959

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://api.flow.team";

// Load FLOW_API_KEY from a .env file if it isn't already in the environment.
// Walks up from this script looking for `.env` (repo root holds the only copy).
// This is the single, gitignored place the user pastes their key.
function loadEnvUpward() {
  if (process.env.FLOW_API_KEY) return;
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const f = join(dir, ".env");
    if (existsSync(f)) {
      for (const line of readFileSync(f, "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
      return;
    }
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
}

function key() {
  loadEnvUpward();
  const k = process.env.FLOW_API_KEY;
  if (!k) throw new Error(
    "FLOW_API_KEY is not set. Copy .env.example to .env at the repo root and paste your Flow API key."
  );
  return k;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Low-level request. Unwraps the { response: {...} } envelope and throws on failure.
 *  Auto-retries on 429 (rate limit, 120 req/min) with backoff — important for the
 *  brief/report (~60+ calls) and unattended scheduled runs. Set { retries: 0 } to disable. */
export async function call(method, path, body, { retries = 3 } = {}) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", "x-flow-api-key": key() },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(BASE + path, opts);
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); }
    catch { throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`); }
    const r = json.response ?? json;
    const code = r.code ?? res.status;

    if ((res.status === 429 || code === 429) && attempt < retries) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : [5000, 15000, 30000][attempt] ?? 30000;
      console.error(`[flow] 429 rate-limited — retry in ${waitMs / 1000}s (${attempt + 1}/${retries})`);
      await sleep(waitMs);
      continue;
    }
    // transient server errors (5xx) — Flow occasionally 500s on a healthy key/endpoint
    // (seen on /user/projects/participants). Retry with backoff so unattended runs survive.
    const is5xx = res.status >= 500 || (code >= 500 && code < 600);
    if (is5xx && attempt < retries) {
      const waitMs = [1000, 3000, 8000][attempt] ?? 8000;
      console.error(`[flow] ${code} server error — retry in ${waitMs / 1000}s (${attempt + 1}/${retries})`);
      await sleep(waitMs);
      continue;
    }
    if (r.success === false) {
      const e = r.error ?? {};
      throw new Error(`Flow API ${r.code} ${e.code ?? ""}: ${e.message ?? r.message ?? "error"}`);
    }
    return r.data;
  }
}

const get = (p) => call("GET", p);
const post = (p, b) => call("POST", p, b);
const patch = (p, b) => call("PATCH", p, b);
const del = (p) => call("DELETE", p);
const qs = (o) => {
  const s = new URLSearchParams(Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined && v !== null)
  )).toString();
  return s ? "?" + s : "";
};

/** Follow cursor paging and return all rows from a list endpoint.
 *  pick(data) must return the array; data also carries { hasNext, lastCursor }. */
export async function pageAll(buildPath, pick, { startCursor = 0, max = 1000 } = {}) {
  const out = [];
  let cursor = startCursor;
  for (let i = 0; i < 50 && out.length < max; i++) {
    const data = await get(buildPath(cursor));
    const rows = pick(data) ?? [];
    out.push(...rows);
    if (!data.hasNext) break;
    cursor = Number(data.lastCursor);
    if (!Number.isFinite(cursor)) break;
  }
  return out.slice(0, max);
}

export const flow = {
  // identity & people
  me: () => get("/user/employees/me"),
  employees: (cursor = 0) => get("/user/employees" + qs({ cursor })),
  employee: (userId) => get(`/user/employees/${encodeURIComponent(userId)}`),
  findEmployees: (searchWord) => get("/user/search/employees" + qs({ searchWord })),
  divisions: () => get("/user/divisions"),

  // projects
  projects: () => get("/user/projects"),
  myProjects: () => get("/user/projects/participants"),
  project: (id) => get(`/user/projects/${id}`),
  participants: (id) => get(`/user/projects/${id}/participants`),
  columns: (id) => get(`/user/projects/${id}/columns`),
  statusColumn: (id) => get(`/user/projects/${id}/columns/status`),
  findProjects: (searchWord) => get("/user/search/projects" + qs({ searchWord })),
  createProject: (body) => post("/user/projects", body),
  addParticipants: (projectId, body) =>
    post(`/user/projects/${projectId}/participants`, body),

  // posts / tasks
  posts: (projectId, { cursor, pageSize } = {}) =>
    get(`/user/posts/projects/${projectId}` + qs({ cursor, pageSize })),
  post: (postId) => get(`/user/posts/${postId}`),
  tasks: (projectId, params = {}) =>
    get(`/user/posts/projects/${projectId}/tasks/filter` + qs(params)),
  findPosts: (searchWord) => get("/user/search/posts" + qs({ searchWord })),

  createPost: (projectId, body) => post(`/user/posts/projects/${projectId}`, body),
  createTask: (projectId, body) => post(`/user/posts/projects/${projectId}/tasks`, body),
  setTaskStatus: (projectId, taskId, status) =>
    patch(`/user/posts/projects/${projectId}/tasks/${taskId}/status`, { status }),
  // Task 2.0 boards: set status by the option's srno (from statusColumn). Mutually
  // exclusive with `status` — the API rejects sending both.
  setTaskStatusOption: (projectId, taskId, optionSrno) =>
    patch(`/user/posts/projects/${projectId}/tasks/${taskId}/status`, { optionSrno }),
  setTaskStartDate: (projectId, taskId, startDate) =>
    patch(`/user/posts/projects/${projectId}/tasks/${taskId}/start-date`, { startDate }),
  setTaskEndDate: (projectId, taskId, endDate) =>
    patch(`/user/posts/projects/${projectId}/tasks/${taskId}/end-date`, { endDate }),
  setTaskPriority: (projectId, taskId, priority) =>
    patch(`/user/posts/projects/${projectId}/tasks/${taskId}/priority`, { priority }),
  setTaskWorkers: (projectId, taskId, workers) =>
    patch(`/user/posts/projects/${projectId}/tasks/${taskId}/worker`, { workers }),
  createSchedule: (projectId, body) => post(`/user/posts/projects/${projectId}/schedules`, body),
  createTodo: (projectId, body) => post(`/user/posts/projects/${projectId}/todos`, body),

  // calendar
  calendars: () => get("/user/calendars"),
  defaultCalendar: () => get("/user/calendars/default"),
  subscribables: (searchWord) => get("/user/calendars/subscribables" + qs({ searchWord })),
  events: (startDateTime, endDateTime) =>
    get("/user/calendars/events" + qs({ startDateTime, endDateTime })),
  event: (eventSrno) => get(`/user/calendars/events/${eventSrno}`),
  findEvents: (searchWord, startDateTime, endDateTime) =>
    get("/user/search/events" + qs({ searchWord, startDateTime, endDateTime })),
  createEvent: (body) => post("/user/calendars/events", body),
  updateEvent: (eventSrno, body) => patch(`/user/calendars/events/${eventSrno}`, body),
  deleteEvent: (eventSrno) => del(`/user/calendars/events/${eventSrno}`),

  // alarms
  alarms: () => get("/user/alarms"),
  // PATCH read / read/all intentionally omitted from the convenience layer —
  // call(...) directly if you really mean to mutate inbox state.
};

// --- tiny CLI ---------------------------------------------------------------
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const [cmd, ...args] = process.argv.slice(2);
  const run = {
    me: () => flow.me(),
    projects: () => flow.myProjects(),
    tasks: () => flow.tasks(args[0], { pageSize: 20 }),
    alarms: () => flow.alarms(),
    events: () => flow.events(args[0], args[1]),
    employees: () => flow.employees(),
    divisions: () => flow.divisions(),
  }[cmd];
  if (!run) {
    console.error("usage: node scripts/flow.mjs <me|projects|tasks <pid>|alarms|events <start14> <end14>|employees|divisions>");
    process.exit(1);
  }
  run().then((d) => console.log(JSON.stringify(d, null, 2)))
       .catch((e) => { console.error(String(e.message || e)); process.exit(1); });
}
