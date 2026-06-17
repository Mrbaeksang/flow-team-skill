# Scheduling the daily report

`scripts/report.mjs` builds your daily brief, diffs it against yesterday, and posts it to a
Flow project (`FLOW_REPORT_PROJECT`, default `2896369`). It's deterministic — no AI needed —
so any scheduler can run it. Pick one:

## Where each option works

| Option | Windows | macOS | Linux | Machine can be off? |
|---|---|---|---|---|
| **A — local scheduler** | ✅ Task Scheduler | ✅ launchd | ✅ cron | ❌ must be on at the time |
| **B — cloud routine** | ✅ | ✅ | ✅ | ✅ always-on |

## Option A — local scheduler (simplest, OS-aware)

Best when your machine is usually on. Zero infrastructure. **One command auto-detects your OS**
and prints the right job — launchd (macOS), cron (Linux), or schtasks (Windows):

```bash
npm run schedule:setup            # prints an install script for 09:00 daily
npm run schedule:setup -- --hour=8 --minute=30   # custom time
```

It **only prints** the commands — it does not change your system. Copy-paste them to actually
schedule it. The printout includes a "test now" command and a "remove later" command for your OS.

Caveat: the machine must be on at the scheduled time (a missed local job doesn't fire until the
next chance). If that's a problem, use Option B.

## Option B — cloud routine (always-on, any OS / app)

Best when the machine may be off, or you're in a hosted/app context with no local shell. Run
`node scripts/report.mjs` on a daily cron in any environment that has this repo + a `.env` with
`FLOW_API_KEY` (a small VM, a CI cron, or a scheduled-agent runner / cloud routine). More setup,
but fires regardless of your laptop.

## Notes

- **Rate limit:** a full report is ~60+ API calls; the API allows 120/minute. `flow.mjs`
  auto-retries on `429` with backoff, so a single scheduled run is safe — just don't fan out
  several runs in the same minute.
- **Day-over-day diff** relies on `~/.flow-report-snapshot.json` persisting between runs. The
  same machine must run it each day for the "전일 대비 변화" section to populate.
- **Preview without posting:** `npm run report -- --dry`.
