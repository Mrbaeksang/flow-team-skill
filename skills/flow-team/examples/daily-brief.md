# Recipe: Daily Brief (데일리 브리핑)

A multi-step agent task that mirrors the agent loop — gather → synthesize → (optionally) act.

## Goal

Produce a short morning brief: tasks that need attention, unread alarms, and today's
calendar — then offer to post it to a project or act on what's overdue.

> **Fast path:** `node scripts/brief.mjs [YYYYMMDD]` already implements steps 1–5 (read-only)
> and prints the synthesized brief. Run it first; fall back to the manual steps below only to
> customize. The script encodes the verified task-column parsing — see the recipe in
> [`reference/API.md`](../reference/API.md).

## Steps

1. **Identity & scope**
   - `flow.me()` → who am I
   - `flow.myProjects()` → my projects (`data.projects[]`)

2. **Unread alarms**
   - `flow.alarms()` → `data.alarms.alarms[]`, keep `readYn === "N"`
   - Group by `registerName` / `content`; note mentions (`mentionYn === "Y"`).

3. **Today's calendar**
   - Build a 14-digit range for today: `YYYYMMDD000000` → `YYYYMMDD235959`
   - `flow.events(start, end)` → `data.events[]` (use `eventStartDateTime`, `eventName`)

4. **At-risk tasks** (across the top few active projects)
   - `flow.tasks(projectId, { pageSize: 50 })` → parse `columns[]` by `defaultColumnType`
     (`TASK_NM`/`STATUS`/`WORKER_ID`/`END_DT`) — see the parsing recipe in `reference/API.md`.
   - Flag tasks not `complete` whose `END_DT` is past/near today.
   - **Only some tasks carry `END_DT`** — report a "no-deadline" count too, don't imply the
     deadline view is complete.

5. **Synthesize** a brief like:
   ```
   ☀️ 오늘의 브리핑 — 2026-06-14
   • 마감 임박/초과 업무 3건:  …
   • 안 읽은 알림 5건 (멘션 1):  …
   • 오늘 일정 2건:  09:30 [FG] AI 교육, 14:00 …
   ```

6. **Propose & act** (with confirmation)
   - "마감 지난 업무 2건 — 마감일 연장할까요, 담당자에게 알림 갈까요?"
   - On yes: `flow.setTaskEndDate(...)`, or post the brief via
     `flow.createPost(projectId, { title, contents })`.

## Notes

- Keep raw JSON out of the final message — summarize.
- Resolve any teammate names via `flow.findEmployees(name)` before assigning.
- Confirm before any write; nothing here writes without the user's go-ahead.
