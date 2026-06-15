// Daily auto-report — builds the brief, diffs it against yesterday's snapshot, and
// posts it as a Flow post to a report project. Deterministic (no AI needed).
//
//   node scripts/report.mjs --dry      # print what would be posted, don't post
//   node scripts/report.mjs            # post today's report to REPORT_PROJECT
//   node scripts/report.mjs 20260615   # a specific date (also accepts --dry)
//
// Schedule it daily (launchd/cron, or a cloud routine). The day-over-day diff needs the
// snapshot file to persist between runs.

import { flow } from "./flow.mjs";
import { gatherBrief, renderBrief, fmtD, ymd } from "./brief.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const REPORT_PROJECT = process.env.FLOW_REPORT_PROJECT || "2896369"; // 📋 데일리 브리핑 보고서
const SNAP = join(homedir(), ".flow-report-snapshot.json");

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const dateArg = args.find((a) => /^\d{8}$/.test(a));
const today = dateArg || ymd(new Date());

const d = await gatherBrief(today);

// --- day-over-day diff ---
const curOverdue = d.overdue.map((t) => t.title);
const curDueToday = d.dueToday.map((t) => t.title);
let diff;
const prev = existsSync(SNAP) ? JSON.parse(readFileSync(SNAP, "utf8")) : null;
if (!prev) {
  diff = "- 전일 스냅샷 없음 (내일부터 변화 비교 시작)";
} else {
  const newOverdue = curOverdue.filter((x) => !(prev.overdue || []).includes(x));
  const resolved = (prev.overdue || []).filter((x) => !curOverdue.includes(x));
  const unreadDelta = d.unread.length - (prev.unread ?? 0);
  const parts = [];
  parts.push(newOverdue.length ? `🆕 새로 밀린 업무 ${newOverdue.length}건: ${newOverdue.join(", ")}` : "🆕 새로 밀린 업무 없음");
  parts.push(resolved.length ? `✅ 해소된(완료/연장) 업무 ${resolved.length}건: ${resolved.join(", ")}` : "✅ 해소된 업무 없음");
  parts.push(`🔔 안읽은 알림 ${unreadDelta >= 0 ? "+" : ""}${unreadDelta} (어제 ${prev.unread ?? 0} → 오늘 ${d.unread.length})`);
  parts.push(`📅 전일 보고: ${prev.date}`);
  diff = parts.map((p) => `- ${p}`).join("\n");
}

// Flow posts do NOT render Markdown — `#`/`##`/backticks show up literally. Convert the
// brief's Markdown to clean plain text before posting.
const toFlowText = (s) => s
  .split("\n")
  .map((line) =>
    line.startsWith("## ") ? "■ " + line.slice(3)
    : line.startsWith("# ") ? line.slice(2)
    : line)
  .join("\n")
  .replace(/`/g, "");

const body = toFlowText(renderBrief(d) + `\n\n## 🔄 전일 대비 변화\n${diff}\n\n— 자동 생성 (report.mjs)`);
const title = `📋 데일리 보고서 — ${fmtD(today)}`;

if (dry) {
  console.log(`[DRY RUN] would post to project ${REPORT_PROJECT}\n\n## ${title}\n${body}`);
} else {
  const r = await flow.createPost(REPORT_PROJECT, { title, contents: body });
  console.log(`Posted: ${r.tinyUrl} (postId ${r.postId}, project ${REPORT_PROJECT})`);
}

// --- save snapshot for tomorrow's diff (skip on dry runs) ---
if (!dry) {
  writeFileSync(SNAP, JSON.stringify({ date: today, overdue: curOverdue, dueToday: curDueToday, unread: d.unread.length }, null, 2));
}
