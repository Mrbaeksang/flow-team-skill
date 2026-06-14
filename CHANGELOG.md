# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Mrbaeksang/flow-team-skill/releases/tag/v0.1.0
