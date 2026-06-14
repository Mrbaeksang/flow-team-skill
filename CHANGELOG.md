# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Mrbaeksang/flow-team-skill/releases/tag/v0.1.0
