---
name: flow-team
description: Use when the user wants to work with Flow (flow.team) — reading or managing projects, tasks, schedules, todos, the calendar, team members, search, or alarms via the Flow Open API. Covers status checks ("what's on my plate", "any unread alarms", "this week's schedule"), creating and updating work (tasks, posts, schedules, calendar events), and team lookups. After reading state, proactively surface what needs attention (overdue tasks, unread alarms, today's events) and offer to act.
---

# Flow Team API Skill

Drive the [Flow](https://flow.team) work-collaboration platform through its Open API.
This skill teaches an agent to **read** workspace state (projects, tasks, calendar,
team, alarms) and **act** on it (create tasks/posts/schedules/todos/events, update
task status & dates, manage the calendar) — and to **propose next steps proactively**.

## Setup (once)

1. The user issues an API key from Flow's **키관리 (Key Management)** page.
2. Put it in **one place only**: copy the repo-root `.env.example` to `.env` and fill it:
   ```
   FLOW_API_KEY=the-users-key
   ```
   `.env` is gitignored — the key is never committed, printed, or shared. If
   `FLOW_API_KEY` isn't set and no `.env` exists, **ask the user to fill `.env`** rather
   than guessing or requesting the key in chat.
3. All requests go to `https://api.flow.team` with two headers:
   ```
   Content-Type: application/json
   x-flow-api-key: <from FLOW_API_KEY>
   ```

A ready-to-use client lives in [`scripts/flow.mjs`](scripts/flow.mjs) (Node 18+, zero
dependencies). It auto-loads the repo-root `.env`. Run `node scripts/flow.mjs me` to
verify the key works.

## The response envelope (read this first)

**Every** response is wrapped:

```json
{ "response": { "success": true, "code": 200, "message": "success", "data": { ... } } }
```

On failure `data` is replaced by `error: { code, message }` (messages are Korean).
Always read `response.data` — `scripts/flow.mjs` unwraps it for you.

## Core capabilities

| You want to… | Call |
|---|---|
| Know who I am | `GET /user/employees/me` |
| List my projects | `GET /user/projects/participants` → `data.projects[]` |
| See a project's tasks (kanban) | `GET /user/posts/projects/{projectId}/tasks/filter` |
| Find a teammate's id | `GET /user/search/employees?searchWord=이름` |
| Create a task | `POST /user/posts/projects/{projectId}/tasks` |
| Move a task / set dates | `PATCH .../tasks/{taskId}/status` · `/end-date` · `/worker` … |
| This week's calendar | `GET /user/calendars/events?startDateTime=…&endDateTime=…` |
| Unread alarms | `GET /user/alarms` → `data.alarms.alarms[]`, filter `readYn === "N"` |
| Org division tree | `GET /user/divisions` |
| **Full daily brief in one shot** | `node scripts/brief.mjs [YYYYMMDD]` — overdue/today/upcoming tasks + unread alarms + today's events, synthesized |
| **Auto-post a daily report** | `node scripts/report.mjs [--dry]` — brief + day-over-day diff, posted to a report project (`FLOW_REPORT_PROJECT`, default 2896369). Schedule daily via [`SCHEDULING.md`](SCHEDULING.md) (`npm run schedule:setup`). |

The **complete** endpoint list, request/response schemas, paging, and the field-name
gotchas live in [`reference/API.md`](reference/API.md). Read it before composing any
write call — several fields differ from what you'd guess (see Gotchas below).

## Gotchas that will bite you (verified live)

- **Date formats differ by endpoint.** Tasks use `YYYYMMDD` (8). Schedules and
  calendar events use `YYYYMMDDHHmmss` (14).
- **`schedule.isAllDay` is a boolean** (`true`/`false`). But **`calendarEvent.allDayYn`
  is a string** (`"Y"`/`"N"`). Same concept, two types.
- **Calendar-event create uses `eventStartTimestamp` / `eventFinishTimestamp`** — yet
  the *read* endpoint returns `eventStartDateTime` / `eventFinishDateTime`. Don't mix.
- **Todos** require `todoList: [{ contents }]` — the checklist items, not a flat body.
- **Workers / attendees must already be participants** of the target project, or the
  call returns `412`. Use `GET /user/projects/{id}/participants` to confirm.
- **Paging** is cursor-based: pass `cursor`, read `data.hasNext` / `data.lastCursor`,
  loop until `hasNext === false`.

## Working style — be proactive (Hermes mode)

This skill is meant to act like a chief-of-staff, not a passive API wrapper.

1. **Gather before answering.** For any "what's going on" question, pull the relevant
   reads in a loop (projects → tasks, alarms, today's events) and synthesize — don't
   dump raw JSON.
2. **Surface what needs attention.** After reading, always call out: overdue/at-risk
   tasks, unread alarms, today's meetings, tasks with no owner.
3. **Propose, then act.** Offer concrete next actions ("3 tasks are past due — want me
   to push their deadlines or ping the owners?") and execute on confirmation.
4. **Confirm before writes.** Creating/patching changes a shared workspace. State
   exactly what you'll write (project, title, dates, assignee) and get a yes first.
5. **Never invent ids.** Resolve project/task/user ids from the read endpoints; never
   guess numeric ids or emails.

## Safety

- The API key is a secret. Keep it in `FLOW_API_KEY`; never print it, commit it, or
  put it in slides/screenshots.
- Writes are real and immediate. There is no task/post delete in the API — only
  calendar events can be deleted. Prefer a throwaway/test project when experimenting.
- Don't call `PATCH /user/alarms/read/all` casually — it clears the user's entire
  alarm inbox state.
