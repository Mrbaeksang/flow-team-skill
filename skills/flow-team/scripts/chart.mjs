// Rich-report chart v2 — renders a full single-image infographic to PNG via headless
// Chrome, returns base64 (for the createPost `imageFiles` attachment). Zero npm deps.
//
// Panels: KPI cards (+어제 대비 ▲▼) · 추세 라인차트 · 프로젝트 워크로드 · 리스크 히트맵 ·
//         상태 분포 · 이번 주 마감 타임라인.
//
// Everything is best-effort: if Chrome isn't found or rendering fails,
// renderReportChart() returns null and report.mjs simply posts text-only.
//
//   import { renderReportChart } from "./chart.mjs";
//   const png = await renderReportChart(d, "20260623", { history, prev });

import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/opt/homebrew/bin/chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
];
const findChrome = () => CHROME_CANDIDATES.find((p) => existsSync(p)) || null;

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const WD = ["일", "월", "화", "수", "목", "금", "토"];
const dObj = (s) => new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
const fmtDW = (s) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)} (${WD[dObj(s).getDay()]})`;
const mmdd = (s) => `${+s.slice(4, 6)}/${+s.slice(6, 8)}`;
const num8 = (s) => (s ? Number(String(s).slice(0, 8)) : null);
const addDays = (s, n) => { const d = dObj(s); d.setDate(d.getDate() + n); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; };

const STATUS_COLOR = {
  "진행": "#0891b2", "대기": "#94a3b8", "피드백": "#f59e0b", "완료": "#22c55e",
  "보류": "#a855f7", "요청": "#ec4899", "(없음)": "#cbd5e1",
};
const palette = ["#0891b2", "#22d3ee", "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#94a3b8"];

// ---- KPI delta badge (어제 대비) ----
// goodDir: "down" → 줄면 초록 / 늘면 빨강. "neutral" → 회색.
function deltaBadge(cur, prevVal, goodDir) {
  if (prevVal === undefined || prevVal === null) return "";
  const diff = cur - prevVal;
  if (diff === 0) return `<span class="badge gray">– 0</span>`;
  const up = diff > 0;
  const arrow = up ? "▲" : "▼";
  let cls = "gray";
  if (goodDir === "down") cls = up ? "red" : "green";
  else if (goodDir === "neutral") cls = "gray";
  return `<span class="badge ${cls}">${arrow} ${Math.abs(diff)}</span>`;
}

// ---- trend line chart as inline SVG (두 시리즈: 미완료·밀린) ----
function trendSvg(history) {
  const pts = history.slice(-14);
  const W = 1100, H = 220, PADL = 44, PADR = 16, PADT = 18, PADB = 34;
  const innerW = W - PADL - PADR, innerH = H - PADT - PADB;
  const series = [
    { key: "open", color: "#0891b2", label: "미완료" },
    { key: "overdue", color: "#ef4444", label: "밀린" },
  ];
  const vals = pts.flatMap((p) => series.map((s) => p[s.key]).filter((v) => v != null));
  const maxV = Math.max(1, ...vals);
  const yMax = Math.ceil(maxV * 1.15);
  const n = pts.length;
  const x = (i) => PADL + (n <= 1 ? innerW / 2 : (innerW * i) / (n - 1));
  const y = (v) => PADT + innerH - (innerH * v) / yMax;

  // gridlines (0, mid, max)
  const grid = [0, Math.round(yMax / 2), yMax].map((g) =>
    `<line x1="${PADL}" y1="${y(g)}" x2="${W - PADR}" y2="${y(g)}" stroke="#eef2f7" stroke-width="1"/>` +
    `<text x="${PADL - 8}" y="${y(g) + 4}" text-anchor="end" font-size="13" fill="#94a3b8">${g}</text>`).join("");

  const xlabels = pts.map((p, i) =>
    (n <= 8 || i % Math.ceil(n / 8) === 0 || i === n - 1)
      ? `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="12" fill="#94a3b8">${mmdd(p.date)}</text>` : "").join("");

  const layers = series.map((s) => {
    const seq = pts.map((p, i) => ({ i, v: p[s.key] })).filter((o) => o.v != null);
    if (!seq.length) return "";
    const poly = seq.map((o) => `${x(o.i)},${y(o.v)}`).join(" ");
    const line = seq.length > 1 ? `<polyline points="${poly}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` : "";
    const dots = seq.map((o) => `<circle cx="${x(o.i)}" cy="${y(o.v)}" r="4.5" fill="#fff" stroke="${s.color}" stroke-width="3"/>`).join("");
    const last = seq[seq.length - 1];
    const tag = `<text x="${x(last.i)}" y="${y(last.v) - 12}" text-anchor="middle" font-size="14" font-weight="800" fill="${s.color}">${last.v}</text>`;
    return line + dots + tag;
  }).join("");

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet">${grid}${layers}${xlabels}</svg>`;
}

function buildHtml(d, today, { history = [], prev = null } = {}) {
  // ----- KPIs with deltas -----
  const kpi = [
    { label: "미완료", value: d.open.length, accent: "#0891b2", prev: prev?.open, dir: "down" },
    { label: "밀린", value: d.overdue.length, accent: "#ef4444", prev: prev?.overdue, dir: "down" },
    { label: "오늘 마감", value: d.dueToday.length, accent: "#f59e0b", prev: prev?.dueToday, dir: "neutral" },
    { label: "마감없음", value: d.noDue.length, accent: "#64748b", prev: prev?.noDue, dir: "down" },
    { label: "담당없음", value: d.ownerless.length, accent: "#a855f7", prev: prev?.ownerless, dir: "down" },
  ];
  const kpiCards = kpi.map((k) => `
    <div class="card">
      <div class="card-v" style="color:${k.accent}">${k.value}</div>
      <div class="card-l">${esc(k.label)} ${deltaBadge(k.value, k.prev, k.dir)}</div>
    </div>`).join("");

  // ----- per-project aggregates (workload + risk) -----
  const byProj = {};
  const bump = (proj) => (byProj[proj] ??= { project: proj, open: 0, overdue: 0, noDue: 0, ownerless: 0 });
  for (const t of d.open) { const p = bump(t.project); p.open++; if (t.end && num8(t.end) < +today) p.overdue++; if (!t.end) p.noDue++; }
  for (const t of d.ownerless) bump(t.project).ownerless++;
  const projects = Object.values(byProj);

  // workload bars (by open count)
  const work = [...projects].sort((a, b) => b.open - a.open).slice(0, 6);
  const workMax = Math.max(1, ...work.map((p) => p.open));
  const workBars = work.length ? work.map((p, i) => `
    <div class="row">
      <div class="row-l" title="${esc(p.project)}">${esc(p.project)}</div>
      <div class="bar-track"><div class="bar" style="width:${(p.open / workMax) * 100}%;background:${palette[i % palette.length]}"></div></div>
      <div class="row-v">${p.open}</div>
    </div>`).join("") : `<div class="empty">열린 업무 없음 👍</div>`;

  // risk heatmap (score = 지연*3 + 담당없음*2 + 무기한*1)
  const scored = projects.map((p) => ({ ...p, score: p.overdue * 3 + p.ownerless * 2 + p.noDue * 1 }))
    .filter((p) => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
  const sevClass = (s) => s >= 10 ? "sev-hi" : s >= 5 ? "sev-mid" : "sev-lo";
  const riskRows = scored.length ? scored.map((p) => `
    <div class="rrow">
      <div class="rname" title="${esc(p.project)}">${esc(p.project)}</div>
      <div class="rmeta">지연 ${p.overdue} · 담당없음 ${p.ownerless} · 무기한 ${p.noDue}</div>
      <div class="rscore ${sevClass(p.score)}">${p.score}</div>
    </div>`).join("") : `<div class="empty">위험 신호 없음 ✨</div>`;

  // ----- status distribution -----
  const statuses = Object.entries(d.statusMix);
  const statusTotal = statuses.reduce((a, [, v]) => a + v, 0) || 1;
  const statusSeg = statuses.map(([k, v]) =>
    `<div class="seg" style="width:${(v / statusTotal) * 100}%;background:${STATUS_COLOR[k] || "#cbd5e1"}"></div>`).join("");
  const statusLegend = statuses.map(([k, v]) =>
    `<span class="lg"><i style="background:${STATUS_COLOR[k] || "#cbd5e1"}"></i>${esc(k)} ${v}</span>`).join("");

  // ----- this-week deadline timeline (today..+6) + overdue bucket -----
  const dayTasks = (ymd) => d.open.filter((t) => t.end && String(t.end).slice(0, 8) === ymd);
  const chip = (t, kind) => `<div class="chip ${kind}" title="${esc(t.title)} 〈${esc(t.project)}〉">${esc(t.title)}</div>`;
  const dayCards = [];
  // overdue bucket first
  dayCards.push(`
    <div class="day ${d.overdue.length ? "day-over" : ""}">
      <div class="day-h"><span class="day-wd" style="color:#ef4444">지남</span><span class="day-n red">${d.overdue.length}</span></div>
      <div class="day-body">${d.overdue.slice(0, 4).map((t) => chip(t, "c-over")).join("") || '<div class="chip-empty">–</div>'}${d.overdue.length > 4 ? `<div class="more">+${d.overdue.length - 4}</div>` : ""}</div>
    </div>`);
  for (let i = 0; i < 7; i++) {
    const ymd = addDays(today, i);
    const ts = dayTasks(ymd);
    const isToday = i === 0;
    dayCards.push(`
      <div class="day ${isToday ? "day-today" : ""}">
        <div class="day-h"><span class="day-wd">${WD[dObj(ymd).getDay()]}</span><span class="day-md">${mmdd(ymd)}</span><span class="day-n ${ts.length ? "cyan" : "gray"}">${ts.length}</span></div>
        <div class="day-body">${ts.slice(0, 4).map((t) => chip(t, isToday ? "c-today" : "c-soon")).join("") || '<div class="chip-empty">–</div>'}${ts.length > 4 ? `<div class="more">+${ts.length - 4}</div>` : ""}</div>
      </div>`);
  }

  const trendNote = history.length < 2 ? `<span class="note">· 데이터 누적 중 (매일 1점씩 쌓임)</span>` : "";

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1240px; font-family:"Apple SD Gothic Neo","Noto Sans KR",-apple-system,sans-serif;
         background:#f1f5f9; color:#0f172a; padding:40px 44px; }
  .head { display:flex; align-items:baseline; justify-content:space-between; }
  .title { font-size:36px; font-weight:800; letter-spacing:-0.6px; }
  .date  { font-size:22px; color:#0891b2; font-weight:800; }
  .sub   { font-size:16px; color:#64748b; margin:4px 0 24px; }
  .kpis  { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:20px; }
  .card  { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:20px 16px; text-align:center; box-shadow:0 1px 3px rgba(15,23,42,.05); }
  .card-v { font-size:48px; font-weight:800; line-height:1; }
  .card-l { font-size:16px; color:#475569; margin-top:10px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px; }
  .badge { font-size:12px; font-weight:800; padding:2px 7px; border-radius:999px; }
  .badge.red { background:#fee2e2; color:#dc2626; } .badge.green { background:#dcfce7; color:#16a34a; } .badge.gray { background:#f1f5f9; color:#94a3b8; }
  .grid2 { display:grid; grid-template-columns:1.15fr 1fr; gap:18px; }
  .panel { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:22px 24px; margin-bottom:18px; box-shadow:0 1px 3px rgba(15,23,42,.05); }
  .panel h2 { font-size:19px; font-weight:800; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .panel h2 .note { font-size:13px; color:#94a3b8; font-weight:600; }
  .legend2 { display:flex; gap:18px; margin-bottom:4px; }
  .legend2 span { font-size:14px; font-weight:700; color:#475569; display:flex; align-items:center; gap:6px; }
  .legend2 i { width:22px; height:4px; border-radius:2px; display:inline-block; }
  .row { display:flex; align-items:center; gap:12px; margin:10px 0; }
  .row-l { width:230px; font-size:15px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .bar-track { flex:1; height:20px; background:#f1f5f9; border-radius:6px; overflow:hidden; }
  .bar { height:100%; border-radius:6px; }
  .row-v { width:36px; text-align:right; font-size:16px; font-weight:800; color:#334155; }
  .empty { color:#94a3b8; font-size:15px; padding:12px 0; }
  .rrow { display:flex; align-items:center; gap:12px; padding:9px 0; border-bottom:1px solid #f1f5f9; }
  .rrow:last-child { border-bottom:none; }
  .rname { width:190px; font-size:15px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .rmeta { flex:1; font-size:13px; color:#64748b; }
  .rscore { width:46px; text-align:center; font-size:17px; font-weight:800; border-radius:8px; padding:5px 0; }
  .sev-hi { background:#fee2e2; color:#dc2626; } .sev-mid { background:#ffedd5; color:#ea580c; } .sev-lo { background:#fef9c3; color:#ca8a04; }
  .statusbar { display:flex; height:28px; border-radius:8px; overflow:hidden; margin-bottom:14px; background:#f1f5f9; }
  .seg { height:100%; }
  .legend { display:flex; flex-wrap:wrap; gap:14px; }
  .lg { font-size:14px; color:#475569; font-weight:600; display:flex; align-items:center; gap:6px; }
  .lg i { width:12px; height:12px; border-radius:3px; display:inline-block; }
  .timeline { display:grid; grid-template-columns:repeat(8,1fr); gap:10px; }
  .day { background:#f8fafc; border:1px solid #eef2f7; border-radius:12px; padding:10px 8px; min-height:128px; }
  .day-today { background:#ecfeff; border-color:#a5f3fc; }
  .day-over { background:#fef2f2; border-color:#fecaca; }
  .day-h { display:flex; align-items:center; gap:5px; margin-bottom:8px; }
  .day-wd { font-size:14px; font-weight:800; color:#334155; }
  .day-md { font-size:12px; color:#94a3b8; font-weight:600; }
  .day-n { margin-left:auto; font-size:13px; font-weight:800; border-radius:999px; padding:1px 8px; }
  .day-n.cyan { background:#cffafe; color:#0891b2; } .day-n.red { background:#fee2e2; color:#dc2626; } .day-n.gray { background:#f1f5f9; color:#cbd5e1; }
  .day-body { display:flex; flex-direction:column; gap:4px; }
  .chip { font-size:11.5px; font-weight:600; padding:3px 6px; border-radius:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .c-over { background:#fee2e2; color:#b91c1c; } .c-today { background:#cffafe; color:#0e7490; } .c-soon { background:#eef2ff; color:#4f46e5; }
  .chip-empty { color:#cbd5e1; font-size:13px; text-align:center; padding-top:6px; }
  .more { font-size:11px; color:#94a3b8; font-weight:700; }
  .foot { font-size:13px; color:#94a3b8; text-align:right; margin-top:6px; }
  </style></head><body>
    <div class="head">
      <div class="title">📋 ${esc(d.me.fullname)}님 데일리 보고서</div>
      <div class="date">${fmtDW(today)}</div>
    </div>
    <div class="sub">${esc(d.me.divisionName)} · ${esc(d.me.responsibility)} · 참여 프로젝트 ${d.projectCount}개</div>

    <div class="kpis">${kpiCards}</div>

    <div class="panel">
      <h2>📈 추세 (최근 ${Math.min(14, Math.max(1, history.length))}일) ${trendNote}</h2>
      <div class="legend2"><span><i style="background:#0891b2"></i>미완료</span><span><i style="background:#ef4444"></i>밀린</span></div>
      ${trendSvg(history)}
    </div>

    <div class="grid2">
      <div class="panel"><h2>📊 업무가 몰린 프로젝트</h2>${workBars}</div>
      <div class="panel"><h2>🚨 프로젝트 리스크 랭킹</h2>${riskRows}</div>
    </div>

    <div class="panel">
      <h2>🗂️ 상태 분포 · 미완료 ${d.open.length}건</h2>
      <div class="statusbar">${statusSeg}</div>
      <div class="legend">${statusLegend}</div>
    </div>

    <div class="panel">
      <h2>🗓️ 이번 주 마감 타임라인</h2>
      <div class="timeline">${dayCards.join("")}</div>
    </div>

    <div class="foot">🤖 자동 생성 · report.mjs · ${fmtDW(today)}</div>
  </body></html>`;
}

/** Render the infographic to a base64 PNG. Returns { fileName, fileContents } or null. */
export async function renderReportChart(d, today, opts = {}) {
  const chrome = findChrome();
  if (!chrome) { console.error("[chart] Chrome not found — skipping image"); return null; }

  let dir;
  try {
    dir = mkdtempSync(join(tmpdir(), "flow-report-"));
    const htmlPath = join(dir, "report.html");
    const pngPath = join(dir, "report.png");
    writeFileSync(htmlPath, buildHtml(d, today, opts), "utf8");

    execFileSync(chrome, [
      "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
      "--force-device-scale-factor=2",
      `--screenshot=${pngPath}`, "--window-size=1240,1560",
      `file://${htmlPath}`,
    ], { stdio: "ignore", timeout: 60000 });

    if (!existsSync(pngPath)) { console.error("[chart] screenshot not produced"); return null; }
    const fileContents = readFileSync(pngPath).toString("base64");
    return { fileName: `daily-report-${today}.png`, fileContents };
  } catch (e) {
    console.error(`[chart] render failed: ${e.message}`);
    return null;
  } finally {
    if (dir) { try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ } }
  }
}
