# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed (cross-platform: same behavior on Windows / macOS / Linux)
- `scripts/schedule-setup.mjs` now **auto-detects the OS** and prints the matching scheduler:
  **launchd** (macOS, unchanged), **cron** (Linux), **schtasks / Task Scheduler** (Windows).
  Was macOS-only before. Each printout includes test-now and remove-later commands for that OS.
- `npm run check` replaced the bash `for` loop with a Node runner (`check.mjs`) — it recursively
  syntax-checks every `.mjs` and runs identically on Windows (cmd/PowerShell), macOS, and Linux.
- CI `check` job now runs on a 3-OS matrix (ubuntu/windows/macos × Node 18/20/22) to prove the
  scripts are portable; the Unix-only secret guard moved to its own ubuntu job.

### Added
- SKILL.md "Where this runs (cross-platform)" — tells the agent to detect the environment first:
  `.mjs` scripts are pure Node (run anywhere), scheduling is OS-specific (handled by
  schedule-setup), and in an app/web context with no local shell it should call the API directly
  and use a cloud routine instead of launchd/cron.
- SCHEDULING.md gained an OS support matrix and folded all three local schedulers into Option A.

## [0.4.1] - 2026-06-16

### Added
- 5 more recipes (catalog now 14): `standup-bot`, `meeting-prep`, `schedule-to-task`,
  `project-kickoff`, `inbox-to-todo` — exercising less-used APIs (search/findPosts,
  createTodo, createProject + addParticipants, calendar→task). `recommend.mjs` picks them up
  automatically. Every card carries 기대효과 / 응답 예시 / live-verified gotchas.
- Every recipe card fleshed out with 무엇 / 기대효과 / 흐름 / 응답 예시 / 배운 것(실호출 검증) / 안전.

## [0.4.0] - 2026-06-16

### Added
- `AGENTS.md` + `CLAUDE.md` at the repo root — entry-point instructions so any agent told to
  "clone and analyze this repo" onboards itself: read `SKILL.md`, guide key setup, lead with
  `npm run brief`, and act proactively. Targets the non-developer "analyze this for me" flow.

### Added
- `skills/flow-team/scripts/report.mjs` — deterministic daily auto-report: builds the brief,
  diffs it against yesterday's snapshot (`~/.flow-report-snapshot.json`), and posts it to a
  report project (`FLOW_REPORT_PROJECT`, default `2896369`). `npm run report` (`--dry` to preview).
- `brief.mjs` refactored to export `gatherBrief()` / `renderBrief()` so `report.mjs` and agents
  reuse the same gather logic instead of re-deriving it.

### Fixed
- `report.mjs` posts clean plain text now — Flow posts don't render Markdown, so `#`/`##`/backticks were showing up literally in the published report.

### Added (recipe catalog + recommendation engine)
- `skills/flow-team/recipes/` — a catalog of API-combination "sets", each a card with
  machine-readable frontmatter (`apis`, `mode`, `signals`, `script`). Seeded with 9: daily-brief,
  daily-report, weekly-report, overdue-triage, meeting-to-tasks, mention-zero, assign-ownerless,
  project-health, bulk-deadline — plus `_index.md` and `_TEMPLATE.md` for authoring your own.
- `scripts/profile.mjs` — computes the user's signals (overdue, unreadMentions, ownerless,
  noDeadline, projects, weekMeetings…) from their key. `npm run profile`.
- `scripts/recommend.mjs` — matches recipe `signals` against the profile and prints a
  personalized, urgency-ranked shortlist with the real numbers. `npm run recommend`.
- SKILL.md "Recommend mode"; README/AGENTS point to the catalog.
- Migrated `examples/` → `recipes/` (structured cards).

### Changed (richer report)
- `report.mjs` is now a **decision-first executive brief**: a top "오늘 결정할 것" queue and a
  bottom "추천 액션" list, plus this-week calendar, workload distribution, status mix, near-term
  unassigned tasks, and mentions enriched with the post they're on (`flow.post`).
- `brief.mjs` `gatherBrief()` gained `{ deep }`, accurate done-detection via status
  `optionCategory` (2=done/3=hold), week events, distribution, and scoped unassigned tasks.
- Surfaced that the 429-retry fix also **fixes silent undercounts** — rate-limited project
  scans used to be skipped, undercounting open tasks; full scans now report the true number.

### Added (robustness & scheduling)
- `flow.mjs` `call()` auto-retries on `429` (rate limit) with backoff — keeps the ~60-call
  brief/report and unattended scheduled runs from failing on a transient limit.
- `scripts/schedule-setup.mjs` (`npm run schedule:setup`) — prints a ready-to-install macOS
  launchd job (with correct absolute paths) to run the daily report on a schedule; prints only,
  never touches the system.
- `SCHEDULING.md` — launchd (local) vs cloud routine, rate-limit & snapshot notes.

### Changed
- **Write endpoints live-verified against the API** (createProject/Task/Todo/Schedule/Event,
  update/deleteEvent, task date & priority PATCHes, addParticipants) — including a real daily
  report posted via `createPost`.
- Documented the **120 requests/minute rate limit** (`429`); a full brief/report is ~60+ calls,
  so back-to-back runs trip it.
- **Status PATCH gotcha (verified):** on current boards the legacy `{ status }` string returns
  success but silently no-ops — you must send `{ optionSrno }`. Docs now lead with `optionSrno`
  / `setTaskStatusOption`, and `overdue-triage.md` recommends it over `setTaskStatus`.
- Documented the `deleteEvent` read-by-srno quirk (confirm deletion via the range query).

### Fixed
- README no longer claims a bare `skills/` dir is auto-recognized; documents that Claude Code
  skill auto-discovery needs `~/.claude/skills/` (or project `.claude/skills/`), while the
  "analyze this repo" flow works via `AGENTS.md`/`SKILL.md`.

## [0.3.0] - 2026-06-15

### Added
- `skills/flow-team/scripts/brief.mjs` — one-shot daily brief (overdue/today/upcoming tasks
  + unread alarms with mention priority + today's events), auto-dated, read-only. `npm run brief`.
- `skills/flow-team/reference/API-FULL.md` — verbatim per-endpoint Request/Response/Error
  schemas for all 39 User-API endpoints, scraped from the Developer Portal.
- `flow.mjs` client wrappers for previously missing endpoints: `divisions` (GET),
  `updateEvent` (PATCH calendar event), `createProject`, `addParticipants`; `divisions` in the CLI.

### Changed
- `API.md`: added the verified task `columns[]` parsing recipe (TASK_NM/STATUS/WORKER_ID/END_DT),
  documented `GET /user/divisions`, the calendar-event update PATCH, verified write bodies for
  `POST /user/projects` and `.../participants` (key is `participantId`), the Task 2.0 `optionSrno`
  status path (mutually exclusive with `status`), and verified `alarms/read` bodies.
- `npm run check` now syntax-checks `setup.mjs` and `brief.mjs` too (was `flow.mjs` only).

### Notes
- Sparse task deadlines: only some tasks carry `END_DT`; deadline-based views must surface a
  "no-deadline" count rather than implying full coverage.

## [0.2.0] - 2026-06-14

### Added
- `setup.mjs` — interactive one-step API-key setup for non-developers (paste key → writes `.env`); `npm run setup`.
- Workflow recipes: `meeting-to-tasks.md`, `weekly-report.md`, `overdue-triage.md` (joining `daily-brief.md`).
- README "무엇을 만들 수 있나" section and a non-developer key-setup path (ask the AI, or `setup.mjs`).

### Changed
- Clarified that the agent runtime is Claude Code / claude.ai (subscription) — no Anthropic API billing key is needed; the only secret is the user's Flow key.

## [0.1.0] - 2026-06-14

### Added
- Initial Flow Open API agent skill package.
- `skills/flow-team/SKILL.md` — agent guidance with progressive disclosure and proactive
  ("Hermes") working style.
- `skills/flow-team/reference/API.md` — complete endpoint reference (projects, employees,
  posts/tasks, calendars, search, alarms) with request/response schemas, verified live.
- `skills/flow-team/scripts/flow.mjs` — zero-dependency Node 18+ client: `.env`
  auto-loading, response-envelope unwrapping, cursor paging, and a small CLI.
- `skills/flow-team/examples/daily-brief.md` — daily-brief recipe (gather → synthesize →
  propose).
- Single-place, gitignored API-key storage via `.env` / `.env.example`.
- Standard repo scaffolding: README, LICENSE (MIT), CONTRIBUTING, SECURITY,
  CODE_OF_CONDUCT, issue/PR templates, and CI.

[Unreleased]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Mrbaeksang/flow-team-skill/releases/tag/v0.1.0
