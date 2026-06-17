// Print a ready-to-install scheduled job that runs the daily report every day.
// It only PRINTS the commands for YOUR OS — it never touches your system.
// You copy-paste the printed commands to actually schedule it.
//
//   node scripts/schedule-setup.mjs            # 09:00 daily
//   node scripts/schedule-setup.mjs --hour=8 --minute=30
//
// OS-aware: macOS → launchd, Linux → cron, Windows → Task Scheduler (schtasks).
// For always-on scheduling regardless of your machine, use a cloud routine instead
// (see SCHEDULING.md "Option B").

import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { homedir, platform } from "node:os";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const reportPath = join(scriptDir, "report.mjs");
const repoRoot = resolve(scriptDir, "../../..");
const node = process.execPath;

const arg = (name, def) => {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? Number(m.split("=")[1]) : def;
};
const hour = arg("hour", 9);
const minute = arg("minute", 0);
const hh = String(hour).padStart(2, "0");
const mm = String(minute).padStart(2, "0");

const LABEL = "com.flowteam.dailyreport";
const envNote = `# Requires FLOW_API_KEY in ${join(repoRoot, ".env")} (already set if 'npm run me' works).`;

function macOS() {
  const plistPath = join(homedir(), "Library", "LaunchAgents", `${LABEL}.plist`);
  const logPath = join(repoRoot, "report.log");
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>                <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${node}</string>
    <string>${reportPath}</string>
  </array>
  <key>WorkingDirectory</key>     <string>${repoRoot}</string>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>               <integer>${hour}</integer>
    <key>Minute</key>             <integer>${minute}</integer>
  </dict>
  <key>RunAtLoad</key>            <false/>
  <key>StandardOutPath</key>      <string>${logPath}</string>
  <key>StandardErrorPath</key>    <string>${logPath}</string>
</dict>
</plist>`;
  return `# macOS launchd — daily report at ${hh}:${mm} (local time).
${envNote}

# 1) Write the launchd job:
cat > "${plistPath}" <<'PLIST'
${plist}
PLIST

# 2) Load it (re-run these two lines after any edit):
launchctl unload "${plistPath}" 2>/dev/null
launchctl load "${plistPath}"

# 3) Verify + test now:
launchctl list | grep ${LABEL}
launchctl start ${LABEL}        #   → check output:  cat "${logPath}"

# Remove later:
launchctl unload "${plistPath}" && rm "${plistPath}"

# Caveat: the Mac must be awake at ${hh}:${mm} (launchd runs a missed job on next wake).`;
}

function linux() {
  const logPath = join(repoRoot, "report.log");
  const cronLine = `${minute} ${hour} * * * cd "${repoRoot}" && "${node}" "${reportPath}" >> "${logPath}" 2>&1`;
  return `# Linux cron — daily report at ${hh}:${mm} (local time).
${envNote}

# 1) Add a cron line (opens your crontab; paste the line below):
( crontab -l 2>/dev/null; echo '${cronLine}' ) | crontab -

# 2) Verify:
crontab -l | grep report.mjs

# 3) Test now (runs the job once):
cd "${repoRoot}" && "${node}" "${reportPath}"   #   → check output:  cat "${logPath}"

# Remove later: run \`crontab -e\` and delete the report.mjs line.
# Caveat: the machine must be on at ${hh}:${mm}. For always-on, use a cloud routine (SCHEDULING.md Option B).`;
}

function windows() {
  // schtasks needs HH:MM 24h. Paths quoted for spaces.
  const time = `${hh}:${mm}`;
  return `:: Windows Task Scheduler — daily report at ${time} (local time). Run in cmd/PowerShell.
:: ${envNote.slice(2)}

:: 1) Create the task:
schtasks /Create /SC DAILY /TN "${LABEL}" /TR "\\"${node}\\" \\"${reportPath}\\"" /ST ${time} /F

:: 2) Verify:
schtasks /Query /TN "${LABEL}"

:: 3) Test now:
schtasks /Run /TN "${LABEL}"

:: Remove later:
schtasks /Delete /TN "${LABEL}" /F

:: Caveat: the PC must be on at ${time}. For always-on, use a cloud routine (SCHEDULING.md Option B).
:: Note: schtasks does not capture stdout to a log; check the report in Flow, or run report.mjs manually to see output.`;
}

const os = platform();
const body = os === "darwin" ? macOS() : os === "win32" ? windows() : linux();
const osName = os === "darwin" ? "macOS (launchd)" : os === "win32" ? "Windows (Task Scheduler)" : "Linux (cron)";

console.log(`# Detected OS: ${osName}\n# Daily report: ${node} ${reportPath}\n`);
console.log(body);
