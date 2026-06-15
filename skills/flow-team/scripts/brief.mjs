// Daily brief — gathers your overdue/today/upcoming tasks across every project,
// unread alarms (mentions & where you're the worker first), and today's calendar
// events, then prints a synthesized briefing.
//
//   node scripts/brief.mjs            # today
//   node scripts/brief.mjs 20260615   # a specific YYYYMMDD
//
// Read-only: makes only GET calls. Heavy by design (one tasks call per project) —
// whitelist projectIds in PROJECT_FILTER if you have many projects.

import { flow, call } from "./flow.mjs";

const me = await flow.me();
const ME = me.userId;

const arg = process.argv[2];
const today = arg && /^\d{8}$/.test(arg) ? arg : ymd(new Date());
const TODAY = Number(today);
const SOON = Number(addDays(today, 3)); // "upcoming" window: next 3 days

// Optional: limit to specific projects (ids as strings). Empty = all my projects.
const PROJECT_FILTER = [];

function ymd(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function addDays(yyyymmdd, n) {
  const d = new Date(Number(yyyymmdd.slice(0, 4)), Number(yyyymmdd.slice(4, 6)) - 1, Number(yyyymmdd.slice(6, 8)));
  d.setDate(d.getDate() + n);
  return ymd(d);
}
const fmtD = (s) => s ? `${String(s).slice(0,4)}-${String(s).slice(4,6)}-${String(s).slice(6,8)}` : "";
const fmtT = (s) => s ? `${String(s).slice(8,10)}:${String(s).slice(10,12)}` : "";
const num8 = (s) => s ? Number(String(s).slice(0, 8)) : null;

// Task column helpers — Flow returns each task as columns[]; the fields we want live
// under defaultColumnType: TASK_NM (title), STATUS, WORKER_ID, END_DT (deadline).
const col = (t, def) => ((t.columns ?? []).find((c) => c.defaultColumnType === def)?.columnData ?? [])[0] ?? null;
const workersOf = (t) => (t.columns ?? []).filter((c) => c.defaultColumnType === "WORKER_ID")
  .flatMap((c) => c.columnData ?? []).map((d) => d.customColumnData);
const endOf = (t) => ((t.columns ?? []).find((c) => c.columnType === "DATE" && c.defaultColumnType === "END_DT")?.columnData ?? [])[0]?.customColumnData ?? null;

const DONE = ["완료", "운영 확인 완료", "보류"]; // statuses treated as not-actionable

// ---- 1) my tasks across projects ----
const { projects } = await flow.myProjects();
const scope = PROJECT_FILTER.length ? projects.filter((p) => PROJECT_FILTER.includes(p.projectId)) : projects;
const mine = [];
for (const p of scope) {
  let data; try { data = await flow.tasks(p.projectId, { pageSize: 100 }); } catch { continue; }
  for (const t of data.tasks ?? []) {
    if (!workersOf(t).includes(ME)) continue;
    mine.push({ project: p.title, title: col(t, "TASK_NM")?.customColumnData ?? "(무제)", status: col(t, "STATUS")?.optionName ?? "", end: endOf(t) });
  }
}
const open = mine.filter((t) => !DONE.includes(t.status));
const dated = open.filter((t) => t.end);
const overdue = dated.filter((t) => num8(t.end) < TODAY).sort((a, b) => num8(a.end) - num8(b.end));
const dueToday = dated.filter((t) => num8(t.end) === TODAY);
const soon = dated.filter((t) => num8(t.end) > TODAY && num8(t.end) <= SOON).sort((a, b) => num8(a.end) - num8(b.end));
const noDue = open.filter((t) => !t.end);

// ---- 2) unread alarms (cursor-paged) ----
let unread = [], cursor = 0;
for (let i = 0; i < 20; i++) {
  const d = (await call("GET", `/user/alarms?cursor=${cursor}`)).alarms;
  for (const a of d.alarms ?? []) if (a.readYn === "N") unread.push(a);
  if (!d.hasNext) break;
  cursor = Number(d.lastCursor);
}
const snippet = (a) => `${a.registerName}: ${(a.content || a.message || "").replace(/\s+/g, " ").slice(0, 40)}`;
const mentions = unread.filter((a) => a.mentionYn === "Y");
const asWorker = unread.filter((a) => a.mentionYn !== "Y" && a.workerYn === "Y");

// ---- 3) today's events (personal calendar; team calendars need a subscription the API doesn't expose) ----
const ev = await flow.events(`${today}000000`, `${today}235959`);
const events = (ev.events ?? []).sort((a, b) => Number(a.eventStartDateTime) - Number(b.eventStartDateTime));

// ---- render ----
const L = [];
L.push(`# 📋 ${me.fullname}님 데일리 브리핑 — ${fmtD(today)}`);
L.push(`소속: ${me.divisionName} · ${me.responsibility}`);
L.push(`\n담당 업무 ${mine.length}건 (미완료 ${open.length}) · 안읽은 알림 ${unread.length} · 오늘 일정 ${events.length}\n`);
L.push(`## 🔴 밀린 업무 (${overdue.length})`);
L.push(overdue.length ? overdue.map((t) => `- ${fmtD(t.end)} | ${t.status || "-"} | ${t.title}  〈${t.project}〉`).join("\n") : "- 없음 👍");
L.push(`\n## 🟡 오늘 마감 (${dueToday.length})`);
L.push(dueToday.length ? dueToday.map((t) => `- ${t.status || "-"} | ${t.title}  〈${t.project}〉`).join("\n") : "- 없음");
L.push(`\n## 🟢 임박 마감 ~${fmtD(String(SOON))} (${soon.length})`);
L.push(soon.length ? soon.map((t) => `- ${fmtD(t.end)} | ${t.title}  〈${t.project}〉`).join("\n") : "- 없음");
L.push(`\n## 🔔 안읽은 알림 (${unread.length})`);
L.push(`- 🗣️ 나 멘션됨: ${mentions.length}건` + (mentions.length ? "\n" + mentions.slice(0, 5).map((a) => `   · ${snippet(a)}`).join("\n") : ""));
L.push(`- 👤 내가 담당: ${asWorker.length}건` + (asWorker.length ? "\n" + asWorker.slice(0, 5).map((a) => `   · ${snippet(a)}`).join("\n") : ""));
L.push(`\n## 📅 오늘 일정 (${events.length})`);
L.push(events.length ? events.map((e) => `- ${e.allDayYn === "Y" ? "종일" : fmtT(e.eventStartDateTime) + "~" + fmtT(e.eventFinishDateTime)} ${e.eventName}`).join("\n") : "- 없음");
L.push(`\n## ℹ️ 레이더 밖`);
L.push(`- 마감일 없는 미완료 업무 ${noDue.length}건 (마감 기준 판단에서 빠짐 — \`setTaskEndDate\`로 마감 부여 가능)`);
console.log(L.join("\n"));
