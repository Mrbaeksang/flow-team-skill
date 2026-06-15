# Scheduling the daily report

`scripts/report.mjs` builds your daily brief, diffs it against yesterday, and posts it to a
Flow project (`FLOW_REPORT_PROJECT`, default `2896369`). It's deterministic — no AI needed —
so any scheduler can run it. Pick one:

## Option A — macOS launchd (local, simplest)

Best when your Mac is usually on. Zero infrastructure.

```bash
npm run schedule:setup            # prints an install script for 09:00 daily
npm run schedule:setup -- --hour=8 --minute=30   # custom time
```

The command **only prints** the launchd job + the commands to install it — it does not change
your system. Copy-paste the printed commands to actually schedule it. To test immediately:
`launchctl start com.flowteam.dailyreport` then `cat report.log`.

Caveat: the Mac must be awake at the scheduled time (launchd runs a missed job on next wake).

## Option B — cloud routine (always-on)

Best when the machine may be off. Run `node scripts/report.mjs` on a daily cron in any
environment that has this repo + a `.env` with `FLOW_API_KEY` (a small VM, a CI cron, a
scheduled-agent runner). More setup, but fires regardless of your laptop.

## Notes

- **Rate limit:** a full report is ~60+ API calls; the API allows 120/minute. `flow.mjs`
  auto-retries on `429` with backoff, so a single scheduled run is safe — just don't fan out
  several runs in the same minute.
- **Day-over-day diff** relies on `~/.flow-report-snapshot.json` persisting between runs. The
  same machine must run it each day for the "전일 대비 변화" section to populate.
- **Preview without posting:** `npm run report -- --dry`.
