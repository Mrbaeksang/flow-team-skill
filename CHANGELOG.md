# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Mrbaeksang/flow-team-skill/releases/tag/v0.1.0
