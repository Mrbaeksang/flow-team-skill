# Recipe: Weekly Report (주간 리포트)

Summarize the week's progress across your active projects — read-only.

## Goal

A concise status readout: what completed, what's in progress, what's overdue, grouped by
project.

## Steps

1. **Scope** — `flow.myProjects()`; pick the top few active projects (or ask the user).
2. **Per project, pull tasks** — `flow.tasks(projectId, { pageSize: 100 })`.
   - Read each task's STATUS column (`columns[]` → the `STATUS` column's
     `columnData[].optionName`): 대기 / 진행 / 완료 / ….
   - Use `flow.statusColumn(projectId)` if you need the full option list / categories.
3. **Bucket** tasks into Completed / In-progress / Overdue (compare the end-date column to
   today, `YYYYMMDD`).
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
