# CLAUDE.md

This repository is the **flow-team** skill — an agent skill package for the Flow (flow.team)
Open API. It is meant to be *used*, not built on.

When a user asks you to analyze this repo or to help with their Flow, follow @AGENTS.md. In
short: read `skills/flow-team/SKILL.md` (the operating manual), make sure `FLOW_API_KEY` is in
`.env` (guide the user through `flow-key.txt` + `node setup.mjs` if not — never take the key in
chat), then lead with `npm run brief` and proactively surface what needs attention. Confirm
before any write; the Flow key is a secret that lives only in `.env`.
