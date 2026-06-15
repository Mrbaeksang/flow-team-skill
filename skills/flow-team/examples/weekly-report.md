# Recipe: Weekly Report (주간 리포트)

Summarize the week's progress across your active projects — read-only.

## Goal

A concise status readout: what completed, what's in progress, what's overdue, grouped by
project.

## Steps

1. **Scope** — `flow.myProjects()`; pick the top few active projects (or ask the user).
2. **Per project, pull tasks** — `flow.tasks(projectId, { pageSize: 100 })`.
   - Parse `columns[]` by `defaultColumnType` — `STATUS` → `columnData[0].optionName`
     (대기/진행/완료/…), `END_DT` → deadline. See the parsing recipe in
     [`reference/API.md`](../reference/API.md).
   - Use `flow.statusColumn(projectId)` if you need the full option list / categories.
3. **Bucket** tasks into Completed / In-progress / Overdue (compare `END_DT` to today,
   `YYYYMMDD`). Tasks without `END_DT` can't be bucketed as overdue — count them separately.
4. **Synthesize** a per-project summary:
   ```
   📊 주간 리포트 — 2026-06-08 ~ 06-14
   ▸ [프로젝트 A]  완료 4 · 진행 3 · 지연 1
     - 지연: "디자인 시안" (담당 김XX, 마감 06-12)
   ▸ [프로젝트 B]  …
   ```
5. **(Optional) Post it** — with confirmation, `flow.createPost(reportProjectId, { title,
   contents })` to a reporting project.

## Notes

- Read-only through step 4 — safe to run anytime.
- Keep raw JSON out of the output; summarize counts and call out only what matters.
