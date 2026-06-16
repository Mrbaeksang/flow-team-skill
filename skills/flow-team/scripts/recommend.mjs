// Recommend — match the recipe catalog against the user's signals and print a
// personalized, ranked shortlist. This is the "맞춤 추천" engine.
//
//   node scripts/recommend.mjs        # profile the user, rank recipes, print top matches
//
// Read-only (it only profiles; running a recipe is a separate, confirmed step).

import { profile } from "./profile.mjs";
import { ymd } from "./brief.mjs";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const recipesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "recipes");

// --- parse a recipe's frontmatter ---
function parseRecipe(file) {
  const text = readFileSync(join(recipesDir, file), "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, k, v] = kv;
    v = v.trim();
    if (v.startsWith("[") && v.endsWith("]")) v = v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    else if (v === "null") v = null;
    fm[k] = v;
  }
  return fm;
}

// --- evaluate a "key op num" condition against signals ---
function evalCond(cond, sig) {
  const m = cond.match(/^(\w+)\s*(>=|<=|>|<|==)\s*(\d+)$/);
  if (!m) return { ok: false, value: 0 };
  const [, key, op, numStr] = m;
  const val = Number(sig[key] ?? 0), num = Number(numStr);
  const ok = op === ">=" ? val >= num : op === "<=" ? val <= num : op === ">" ? val > num : op === "<" ? val < num : val === num;
  return { ok, value: val, key };
}

const today = (process.argv[2] && /^\d{8}$/.test(process.argv[2])) ? process.argv[2] : ymd(new Date());
const sig = await profile(today);

const recipes = readdirSync(recipesDir)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .map(parseRecipe)
  .filter(Boolean);

// urgency priority per signal (lower = more actionable). Specific needs beat broad ones,
// so "마감 트리아지" (overdue) outranks a generic "openTasks>0" brief.
const PRIO = { overdue: 1, dueToday: 1, unreadMentions: 2, ownerless: 3, soon: 4, noDeadline: 5,
  unreadAlarms: 6, asWorker: 6, weekMeetings: 8, openTasks: 9, projects: 9 };

const matched = [], onDemand = [];
for (const r of recipes) {
  const conds = Array.isArray(r.signals) ? r.signals : [];
  if (conds.length === 0) { onDemand.push(r); continue; }
  const evals = conds.map((c) => evalCond(c, sig));
  if (evals.every((e) => e.ok)) {
    const score = evals.reduce((s, e) => s + e.value, 0);
    const urgency = Math.min(...evals.map((e) => PRIO[e.key] ?? 7));
    matched.push({ r, score, urgency, reasons: evals.map((e) => `${e.key}=${e.value}`) });
  }
}
matched.sort((a, b) => a.urgency - b.urgency || b.score - a.score);

// --- render ---
console.log(`📊 당신의 신호: ${Object.entries(sig).map(([k, v]) => `${k} ${v}`).join(" · ")}\n`);
console.log("👉 지금 당신에게 유용한 레시피 (데이터 기준 추천)");
if (!matched.length) {
  console.log("  · 지금 급히 권할 자동화 신호 없음 — 아래 상시 레시피를 참고하세요.");
} else {
  matched.slice(0, 5).forEach((m, i) => {
    const run = m.r.script ? `npm run ${m.r.script}` : `"${m.r.title} 해줘"`;
    console.log(`  ${i + 1}. ${m.r.title} — ${m.r.what}\n       근거: ${m.reasons.join(", ")}  ·  실행: ${run}  [${m.r.mode}]`);
  });
}
console.log("\n🗂️ 상시/온디맨드 레시피");
for (const r of onDemand) console.log(`  · ${r.title} — ${r.what}`);
console.log("\n새 레시피를 원하면: \"이런 거 자동화하는 레시피 만들어줘: …\" → 카드+스크립트 생성");
