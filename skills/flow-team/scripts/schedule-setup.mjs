// Print a ready-to-install macOS launchd job that runs the daily report every day.
// It only PRINTS the plist + the install commands — it does NOT touch your system.
// You copy-paste the commands to actually schedule it.
//
//   node scripts/schedule-setup.mjs            # 09:00 daily
//   node scripts/schedule-setup.mjs --hour=8 --minute=30
//
// (macOS only. The Mac must be awake/on at the scheduled time; launchd runs a missed
//  job when the machine next wakes. For always-on scheduling, use a cloud routine instead.)

import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";

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

const LABEL = "com.flowteam.dailyreport";
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

const hh = String(hour).padStart(2, "0");
const mm = String(minute).padStart(2, "0");

console.log(`# Daily report at ${hh}:${mm} — runs: ${node} ${reportPath}
# Requires FLOW_API_KEY in ${join(repoRoot, ".env")} (already set if 'npm run me' works).

# 1) Write the launchd job:
cat > "${plistPath}" <<'PLIST'
${plist}
PLIST

# 2) Load it (re-run these two lines after any edit):
launchctl unload "${plistPath}" 2>/dev/null
launchctl load "${plistPath}"

# 3) Verify it's registered:
launchctl list | grep ${LABEL}

# Run once now to test (without waiting for ${hh}:${mm}):
launchctl start ${LABEL}
#   → check output:  cat "${logPath}"

# To stop/remove the schedule later:
launchctl unload "${plistPath}" && rm "${plistPath}"`);
