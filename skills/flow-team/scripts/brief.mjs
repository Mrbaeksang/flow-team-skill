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
const workersOf = (t) => {
  const wc = (t.columns ?? []).find((c) => c.defaultColumnType === "WORKER_ID");
  return wc ? (wc.columnData ?? []).map((d) => d.customColumnData) : null; // null = 담당자 컬럼 없는 공지/안내형
};
const endOf = (t) => ((t.columns ?? []).find((c) => c.columnType === "DATE" && c.defaultColumnType === "END_DT")?.columnData ?? [])[0]?.customColumnData ?? null;
const taskIdOf = (t) => t.taskId;

const DONE = ["완료", "운영 확인 완료", "보류"]; // statuses treated as not-actionable

// ---- gather (read-only): returns structured data, no rendering ----
export async function gatherBrief(today, { projectFilter = [], deep = false } = {}) {
  const me = await flow.me();
  const ME = me.userId;
  const MY_EMAIL = me.email ?? null;
  const SOON = Number(addDays(today, 3));
  const TODAY = Number(today);

  const { projects } = await flow.myProjects();
  const scope = projectFilter.length ? projects.filter((p) => projectFilter.includes(p.projectId)) : projects;
  const mine = [], ownerlessAll = [];
  for (const p of scope) {
    let data; try { data = await flow.tasks(p.projectId, { pageSize: 100 }); } catch { continue; }
    for (const t of data.tasks ?? []) {
      const ws = workersOf(t); // null = 공지/안내형(담당 개념 없음) · [] = 담당자 컬럼 있으나 미배정
      const st = col(t, "STATUS");
      const rec = { project: p.title, projectId: p.projectId, taskId: taskIdOf(t),
        title: col(t, "TASK_NM")?.customColumnData ?? "(무제)",
        status: st?.optionName ?? "", statusCat: st?.optionCategory ?? "", end: endOf(t), workers: ws ?? [] };
      if (ws && (ws.includes(ME) || (MY_EMAIL && ws.includes(MY_EMAIL)))) mine.push(rec);
      else if (ws && ws.length === 0) ownerlessAll.push(rec); // 담당자 컬럼 있으나 미배정 (공지형 제외)
    }
  }
  // "not actionable" = explicit names OR status category 2 (done) / 3 (hold)
  const isDone = (t) => DONE.includes(t.status) || ["2", "3"].includes(String(t.statusCat));
  const open = mine.filter((t) => !isDone(t));
  const dated = open.filter((t) => t.end);
  const overdue = dated.filter((t) => num8(t.end) < TODAY).sort((a, b) => num8(a.end) - num8(b.end));
  const dueToday = dated.filter((t) => num8(t.end) === TODAY);
  const soon = dated.filter((t) => num8(t.end) > TODAY && num8(t.end) <= SOON).sort((a, b) => num8(a.end) - num8(b.end));
  const noDue = open.filter((t) => !t.end);

  // workload distribution (my open tasks by project) + status mix
  const byProject = {};
  for (const t of open) byProject[t.project] = (byProject[t.project] || 0) + 1;
  const distribution = Object.entries(byProject).map(([project, count]) => ({ project, count })).sort((a, b) => b.count - a.count);
  const statusMix = {};
  for (const t of open) statusMix[t.status || "(없음)"] = (statusMix[t.status || "(없음)"] || 0) + 1;
  // unassigned open tasks with a NEAR-TERM deadline (today..+14) — actionable, not ancient noise
  const ownerWindow = Number(addDays(today, 14));
  const ownerless = ownerlessAll
    .filter((t) => !isDone(t) && t.end && num8(t.end) >= TODAY && num8(t.end) <= ownerWindow)
    .sort((a, b) => num8(a.end) - num8(b.end));

  // alarms (cursor-paged)
  let unread = [], cursor = 0;
  for (let i = 0; i < 20; i++) {
    const d = (await call("GET", `/user/alarms?cursor=${cursor}`)).alarms;
    for (const a of d.alarms ?? []) if (a.readYn === "N") unread.push(a);
    if (!d.hasNext) break;
    cursor = Number(d.lastCursor);
  }
  const mentions = unread.filter((a) => a.mentionYn === "Y");
  const asWorker = unread.filter((a) => a.mentionYn !== "Y" && a.workerYn === "Y");

  // deep: enrich each mention with the title of the post it's on (capped)
  if (deep) {
    for (const a of mentions.slice(0, 6)) {
      try { const p = await flow.post(a.postId); a.postTitle = (p.title ?? p.post?.title ?? "").slice(0, 50); } catch { /* ignore */ }
    }
  }

  // calendar: this week (today..+6), with today split out
  const weekEnd = addDays(today, 6);
  const ev = await flow.events(`${today}000000`, `${weekEnd}235959`);
  const weekEvents = (ev.events ?? []).sort((a, b) => Number(a.eventStartDateTime) - Number(b.eventStartDateTime));
  const events = weekEvents.filter((e) => String(e.eventStartDateTime).slice(0, 8) === today);

  return { me, today, mine, open, overdue, dueToday, soon, noDue, distribution, statusMix, ownerless,
    unread, mentions, asWorker, events, weekEvents, projectCount: scope.length };
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
