# AGENTS.md — instructions for any AI agent working in this repo

This repository **is a ready-to-use skill, not an app to build.** A non-developer has most
likely cloned it and asked you to "analyze it" or "help me with my Flow." Your job is to get
them using Flow (flow.team) through this skill — quickly, safely, and proactively. Do not
start writing application code; operate the skill.

## Do this, in order

1. **Read the skill's brain.** Open [`skills/flow-team/SKILL.md`](skills/flow-team/SKILL.md) —
   it is your operating manual: how to read Flow state (projects, tasks, calendar, members,
   alarms) and act on it, plus a proactive "chief-of-staff" working style. Deeper endpoint
   schemas live in [`skills/flow-team/reference/API.md`](skills/flow-team/reference/API.md)
   (and the verbatim portal scrape in `API-FULL.md`).

2. **Make sure the API key is set.** Every call needs `FLOW_API_KEY` in a `.env` at the repo
   root. If `.env` is missing, **do not ask for the key in chat.** Instead:
   - Create an empty `flow-key.txt` at the repo root.
   - Ask the user to paste their Flow key (from Flow's 키관리 / Key Management page) into that
     file and save it.
   - Run `node setup.mjs` — it moves the key into `.env` and deletes `flow-key.txt`. You never
     read the key yourself.
   - Verify with `npm run me` → it prints the user's name.

3. **Lead with value.** Run `npm run brief` (read-only) to print today's daily brief — overdue
   / today / upcoming tasks, unread alarms (mentions first), and today's calendar. Show it,
   then offer next actions.

4. **Be proactive.** After any read, surface what needs attention (overdue tasks, unread
   alarms, today's meetings, ownerless tasks) and propose concrete next steps. This skill is a
   chief-of-staff, not a passive API wrapper.

## Hard rules (do not break)

- **The Flow key is a secret.** Never print it, commit it, or accept it pasted in chat — only
  `.env` (gitignored) holds it.
- **Writes are real and mostly irreversible** — there is no delete for tasks/posts/schedules/
  todos (only calendar events). State exactly what you'll write (project, title, dates,
  assignee) and get a "yes" before every create/update.
- **Never invent ids.** Resolve project/task/user ids from the read endpoints; a worker/
  attendee must already be a project participant or the API returns `412`.
- **Don't clear the alarm inbox casually** (`PATCH /user/alarms/read/all`).

## What the user can just ask for (recipes in `skills/flow-team/examples/`)

| Ask | Recipe |
|---|---|
| "오늘 브리핑 해줘" | `daily-brief.md` · or `npm run brief` |
| "회의록 붙여넣을게, 업무로 만들어줘" | `meeting-to-tasks.md` |
| "주간 리포트 정리해줘" | `weekly-report.md` |
| "마감 지난 업무 점검해줘" | `overdue-triage.md` |

## Note on "installing" as a Claude Code skill (optional)

Auto-discovery as a Claude Code skill requires the skill to live under `~/.claude/skills/` or a
project's `.claude/skills/`. For the "analyze this repo" flow above you don't need that — just
read `SKILL.md` and follow it. To register it permanently, symlink or copy
`skills/flow-team` into `~/.claude/skills/`.
