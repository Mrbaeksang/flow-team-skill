// Daily auto-report — a decision-first executive brief, posted to a Flow project.
// Mixes tasks, alarms (mentions enriched with the post they're on), calendar (this week),
// workload distribution, and unassigned work into one "read it and just decide" report.
//
//   node scripts/report.mjs --dry      # print what would be posted, don't post
//   node scripts/report.mjs            # post today's report to REPORT_PROJECT
//   node scripts/report.mjs 20260616   # a specific date
//
// Deterministic (no AI). Day-over-day diff needs ~/.flow-report-snapshot.json to persist.

import { flow } from "./flow.mjs";
import { gatherBrief, fmtD, ymd, addDays } from "./brief.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const REPORT_PROJECT = process.env.FLOW_REPORT_PROJECT || "2896369";
const SNAP = join(homedir(), ".flow-report-snapshot.json");

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const dateArg = args.find((a) => /^\d{8}$/.test(a));
const today = dateArg || ymd(new Date());

const WD = ["일", "월", "화", "수", "목", "금", "토"];
const weekday = (yyyymmdd) => WD[new Date(Number(yyyymmdd.slice(0, 4)), Number(yyyymmdd.slice(4, 6)) - 1, Number(yyyymmdd.slice(6, 8))).getDay()];
const fmtDW = (s) => `${fmtD(s)} (${weekday(s)})`;
const t14 = (s) => `${String(s).slice(8, 10)}:${String(s).slice(10, 12)}`;
const clip = (s, n) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);
const RULE = "──────────────────────────";

const d = await gatherBrief(today, { deep: true });

// ---------- day-over-day diff ----------
const curOverdue = d.overdue.map((t) => t.title);
const curDueToday = d.dueToday.map((t) => t.title);
const prev = existsSync(SNAP) ? JSON.parse(readFileSync(SNAP, "utf8")) : null;
let diffLines;
if (!prev) {
  diffLines = ["· 전일 스냅샷 없음 (내일부터 변화 비교 시작)"];
} else {
  const newOverdue = curOverdue.filter((x) => !(prev.overdue || []).includes(x));
  const resolved = (prev.overdue || []).filter((x) => !curOverdue.includes(x));
  const unreadDelta = d.unread.length - (prev.unread ?? 0);
  diffLines = [
    newOverdue.length ? `🆕 새로 밀린 업무 ${newOverdue.length}건: ${newOverdue.join(", ")}` : "🆕 새로 밀린 업무 없음",
    resolved.length ? `✅ 밀림 해소 ${resolved.length}건: ${resolved.join(", ")}` : "✅ 해소된 밀린 업무 없음",
    `🔔 안읽은 알림 ${unreadDelta >= 0 ? "+" : ""}${unreadDelta} (어제 ${prev.unread ?? 0} → 오늘 ${d.unread.length})`,
    `📅 직전 보고: ${prev.date}`,
  ].map((p) => `· ${p}`);
}

// ---------- decision queue (top) ----------
const decisions = [];
if (d.overdue.length) decisions.push(`🔴 밀린 업무 ${d.overdue.length}건 — 연장 / 완료처리 / 재배정 결정 필요`);
if (d.dueToday.length) decisions.push(`🟡 오늘 마감 ${d.dueToday.length}건 — 진행상황 점검, 필요시 마감 조정`);
if (d.mentions.length) decisions.push(`🗣️ 답해야 할 멘션 ${d.mentions.length}건 — 답글 필요`);
if (d.events.length) decisions.push(`🗓️ 오늘 일정 ${d.events.length}건 — 시간 확인`);
const decisionBlock = decisions.length
  ? decisions.map((x, i) => ` ${i + 1}. ${x}`).join("\n")
  : " ✅ 오늘 꼭 결정할 건 없음 — 가볍게 진행하세요 👍";

// one-line gut check
const headline = [
  d.overdue.length ? `밀린 ${d.overdue.length}` : null,
  d.dueToday.length ? `오늘마감 ${d.dueToday.length}` : null,
  d.mentions.length ? `멘션 ${d.mentions.length}` : null,
  d.events.length ? `일정 ${d.events.length}` : null,
].filter(Boolean).join(" · ") || "급한 불 없음";

// ---------- recommended actions (bottom) ----------
const recs = [];
if (d.overdue.length) recs.push(`"밀린 거 마감 연장해줘" / "완료처리해줘" → 제가 실행`);
if (d.dueToday.length) recs.push(`"오늘 마감 상태 업데이트해줘"`);
if (d.mentions.length) recs.push(`"멘션 답글 초안 써줘"`);
if (d.noDue.length) recs.push(`마감 없는 미완료 ${d.noDue.length}건 → "마감일 정해줘"`);
if (d.ownerless.length) recs.push(`담당 없는 업무 ${d.ownerless.length}건 → "담당 지정 도와줘"`);
if (!recs.length) recs.push("특별히 권할 액션 없음 — 오늘은 가볍게!");

// ---------- compose ----------
const taskLine = (t, withDate = true) => `   · ${withDate ? fmtD(t.end) + " " : ""}${t.title} 〈${t.project}〉${t.status ? " [" + t.status + "]" : ""}`;
const evLine = (e, withDate = false) => `   · ${withDate ? fmtDW(String(e.eventStartDateTime).slice(0, 8)) + " " : ""}${e.allDayYn === "Y" ? "종일" : t14(e.eventStartDateTime) + "~" + t14(e.eventFinishDateTime)} ${e.eventName}${e.location ? " @" + e.location : ""}`;
const mentionLine = (a) => `   · ${a.registerName}: "${clip(a.content || a.message, 50)}"${a.postTitle ? ` — 〈${a.postTitle}〉` : ""}`;

const L = [];
L.push(`📋 ${d.me.fullname}님 데일리 보고서 · ${fmtDW(today)}`);
L.push(`👤 ${d.me.divisionName} · ${d.me.responsibility}`);
L.push(`📊 미완료 ${d.open.length} · 안읽은 알림 ${d.unread.length} · 오늘 일정 ${d.events.length} · 밀린 ${d.overdue.length}`);
L.push("");
L.push("👉 오늘 결정할 것");
L.push(decisionBlock);
L.push(`\n💬 한 줄: ${headline}`);

L.push(`\n${RULE}\n🔥 즉시 처리`);
L.push(`🔴 밀린 업무 (${d.overdue.length})`);
L.push(d.overdue.length ? d.overdue.map((t) => taskLine(t)).join("\n") : "   · 없음 👍");
L.push(`🗣️ 답해야 할 멘션 (${d.mentions.length})`);
L.push(d.mentions.length ? d.mentions.slice(0, 6).map(mentionLine).join("\n") : "   · 없음");

L.push(`\n${RULE}\n📅 오늘 (${fmtDW(today)})`);
L.push(`🟡 오늘 마감 (${d.dueToday.length})`);
L.push(d.dueToday.length ? d.dueToday.map((t) => taskLine(t, false)).join("\n") : "   · 없음");
L.push(`🗓️ 오늘 일정 (${d.events.length})`);
L.push(d.events.length ? d.events.map((e) => evLine(e)).join("\n") : "   · 없음");

const weekAhead = d.weekEvents.filter((e) => String(e.eventStartDateTime).slice(0, 8) !== today);
L.push(`\n${RULE}\n🟢 이번 주 예보`);
L.push(`임박 마감 ~${fmtD(addDays(today, 3))} (${d.soon.length})`);
L.push(d.soon.length ? d.soon.map((t) => taskLine(t)).join("\n") : "   · 없음");
L.push(`🗓️ 이번 주 남은 일정 (${weekAhead.length})`);
L.push(weekAhead.length ? weekAhead.map((e) => evLine(e, true)).join("\n") : "   · 없음");

L.push(`\n${RULE}\n📊 현황`);
const mix = Object.entries(d.statusMix).map(([k, v]) => `${k} ${v}`).join(" · ") || "-";
L.push(`· 미완료 ${d.open.length} · 마감없음 ${d.noDue.length} · 담당없음(마감有) ${d.ownerless.length}`);
L.push(`· 상태 분포: ${mix}`);
const top = d.distribution.slice(0, 3).map((x) => `${x.project}(${x.count})`).join(" · ");
if (top) L.push(`· 업무 몰린 프로젝트: ${top}`);
if (d.ownerless.length) L.push(`· 담당 없는 업무(마감 임박):\n${d.ownerless.slice(0, 3).map((t) => taskLine(t)).join("\n")}`);
if (d.noDue.length) L.push(`· 마감일 없는 미완료 ${d.noDue.length}건 (마감 기준 판단에서 빠짐)`);

L.push(`\n${RULE}\n🔄 전일 대비 변화`);
L.push(diffLines.join("\n"));

L.push(`\n${RULE}\n💡 추천 액션 (이렇게 시키면 제가 실행)`);
L.push(recs.map((r) => ` • ${r}`).join("\n"));

L.push(`\n— 자동 생성 · report.mjs`);

const body = L.join("\n");
const title = `📋 데일리 보고서 — ${fmtDW(today)}`;

if (dry) {
  console.log(`[DRY RUN] would post to project ${REPORT_PROJECT}\n\n${title}\n${RULE}\n${body}`);
} else {
  const r = await flow.createPost(REPORT_PROJECT, { title, contents: body });
  console.log(`Posted: ${r.tinyUrl} (postId ${r.postId}, project ${REPORT_PROJECT})`);
  writeFileSync(SNAP, JSON.stringify({ date: today, overdue: curOverdue, dueToday: curDueToday, unread: d.unread.length }, null, 2));
}
