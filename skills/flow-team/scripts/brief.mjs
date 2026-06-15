// Daily brief — gathers your overdue/today/upcoming tasks across every project,
// unread alarms (mentions & where you're the worker first), and today's calendar.
//
//   node scripts/brief.mjs            # print today's brief
//   node scripts/brief.mjs 20260615   # a specific YYYYMMDD
//
// Read-only: GET calls only. Also exports gatherBrief()/renderBrief() so report.mjs
// (and agents) can reuse the same data without re-deriving it.

import { flow, call } from "./flow.mjs";

// ---- date / parsing helpers (exported for reuse) ----
export const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
export function addDays(yyyymmdd, n) {
  const d = new Date(Number(yyyymmdd.slice(0, 4)), Number(yyyymmdd.slice(4, 6)) - 1, Number(yyyymmdd.slice(6, 8)));
  d.setDate(d.getDate() + n);
  return ymd(d);
}
export const fmtD = (s) => s ? `${String(s).slice(0,4)}-${String(s).slice(4,6)}-${String(s).slice(6,8)}` : "";
const fmtT = (s) => s ? `${String(s).slice(8,10)}:${String(s).slice(10,12)}` : "";
const num8 = (s) => s ? Number(String(s).slice(0, 8)) : null;

const col = (t, def) => ((t.columns ?? []).find((c) => c.defaultColumnType === def)?.columnData ?? [])[0] ?? null;
const workersOf = (t) => (t.columns ?? []).filter((c) => c.defaultColumnType === "WORKER_ID")
  .flatMap((c) => c.columnData ?? []).map((d) => d.customColumnData);
const endOf = (t) => ((t.columns ?? []).find((c) => c.columnType === "DATE" && c.defaultColumnType === "END_DT")?.columnData ?? [])[0]?.customColumnData ?? null;
const taskIdOf = (t) => t.taskId;

const DONE = ["완료", "운영 확인 완료", "보류"]; // statuses treated as not-actionable

// ---- gather (read-only): returns structured data, no rendering ----
export async function gatherBrief(today, { projectFilter = [] } = {}) {
  const me = await flow.me();
  const ME = me.userId;
  const SOON = Number(addDays(today, 3));
  const TODAY = Number(today);

  const { projects } = await flow.myProjects();
  const scope = projectFilter.length ? projects.filter((p) => projectFilter.includes(p.projectId)) : projects;
  const mine = [];
  for (const p of scope) {
    let data; try { data = await flow.tasks(p.projectId, { pageSize: 100 }); } catch { continue; }
    for (const t of data.tasks ?? []) {
      if (!workersOf(t).includes(ME)) continue;
      mine.push({ project: p.title, projectId: p.projectId, taskId: taskIdOf(t),
        title: col(t, "TASK_NM")?.customColumnData ?? "(무제)", status: col(t, "STATUS")?.optionName ?? "", end: endOf(t) });
    }
  }
  const open = mine.filter((t) => !DONE.includes(t.status));
  const dated = open.filter((t) => t.end);
  const overdue = dated.filter((t) => num8(t.end) < TODAY).sort((a, b) => num8(a.end) - num8(b.end));
  const dueToday = dated.filter((t) => num8(t.end) === TODAY);
  const soon = dated.filter((t) => num8(t.end) > TODAY && num8(t.end) <= SOON).sort((a, b) => num8(a.end) - num8(b.end));
  const noDue = open.filter((t) => !t.end);

  let unread = [], cursor = 0;
  for (let i = 0; i < 20; i++) {
    const d = (await call("GET", `/user/alarms?cursor=${cursor}`)).alarms;
    for (const a of d.alarms ?? []) if (a.readYn === "N") unread.push(a);
    if (!d.hasNext) break;
    cursor = Number(d.lastCursor);
  }
  const mentions = unread.filter((a) => a.mentionYn === "Y");
  const asWorker = unread.filter((a) => a.mentionYn !== "Y" && a.workerYn === "Y");

  const ev = await flow.events(`${today}000000`, `${today}235959`);
  const events = (ev.events ?? []).sort((a, b) => Number(a.eventStartDateTime) - Number(b.eventStartDateTime));

  return { me, today, mine, open, overdue, dueToday, soon, noDue, unread, mentions, asWorker, events };
}

// ---- render: structured data → text brief ----
export function renderBrief(d) {
  const snippet = (a) => `${a.registerName}: ${(a.content || a.message || "").replace(/\s+/g, " ").slice(0, 40)}`;
  const SOON = addDays(d.today, 3);
  const L = [];
  L.push(`# 📋 ${d.me.fullname}님 데일리 브리핑 — ${fmtD(d.today)}`);
  L.push(`소속: ${d.me.divisionName} · ${d.me.responsibility}`);
  L.push(`\n담당 업무 ${d.mine.length}건 (미완료 ${d.open.length}) · 안읽은 알림 ${d.unread.length} · 오늘 일정 ${d.events.length}\n`);
  L.push(`## 🔴 밀린 업무 (${d.overdue.length})`);
  L.push(d.overdue.length ? d.overdue.map((t) => `- ${fmtD(t.end)} | ${t.status || "-"} | ${t.title}  〈${t.project}〉`).join("\n") : "- 없음 👍");
  L.push(`\n## 🟡 오늘 마감 (${d.dueToday.length})`);
  L.push(d.dueToday.length ? d.dueToday.map((t) => `- ${t.status || "-"} | ${t.title}  〈${t.project}〉`).join("\n") : "- 없음");
  L.push(`\n## 🟢 임박 마감 ~${fmtD(SOON)} (${d.soon.length})`);
  L.push(d.soon.length ? d.soon.map((t) => `- ${fmtD(t.end)} | ${t.title}  〈${t.project}〉`).join("\n") : "- 없음");
  L.push(`\n## 🔔 안읽은 알림 (${d.unread.length})`);
  L.push(`- 🗣️ 나 멘션됨: ${d.mentions.length}건` + (d.mentions.length ? "\n" + d.mentions.slice(0, 5).map((a) => `   · ${snippet(a)}`).join("\n") : ""));
  L.push(`- 👤 내가 담당: ${d.asWorker.length}건` + (d.asWorker.length ? "\n" + d.asWorker.slice(0, 5).map((a) => `   · ${snippet(a)}`).join("\n") : ""));
  L.push(`\n## 📅 오늘 일정 (${d.events.length})`);
  L.push(d.events.length ? d.events.map((e) => `- ${e.allDayYn === "Y" ? "종일" : fmtT(e.eventStartDateTime) + "~" + fmtT(e.eventFinishDateTime)} ${e.eventName}`).join("\n") : "- 없음");
  L.push(`\n## ℹ️ 레이더 밖`);
  L.push(`- 마감일 없는 미완료 업무 ${d.noDue.length}건 (마감 기준 판단에서 빠짐 — \`setTaskEndDate\`로 마감 부여 가능)`);
  return L.join("\n");
}

// ---- CLI ----
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const arg = process.argv[2];
  const today = arg && /^\d{8}$/.test(arg) ? arg : ymd(new Date());
  const d = await gatherBrief(today);
  console.log(renderBrief(d));
}
