# Recipe: Overdue Triage (마감 임박·초과 업무 정리)

Find tasks that are slipping and help the user act on them.

## Goal

Surface past-due and at-risk tasks across projects, then offer to extend deadlines,
reassign, or nudge — acting only on confirmation.

## Steps

1. **Scope** — `flow.myProjects()`; iterate the active ones (or ask).
2. **Pull tasks** — `flow.tasks(projectId, { pageSize: 100 })` per project. Parse `columns[]`
   by `defaultColumnType` (`TASK_NM`/`STATUS`/`WORKER_ID`/`END_DT`) — see the parsing recipe in
   [`reference/API.md`](../reference/API.md). (`scripts/brief.mjs` already does this extraction.)
3. **Flag** any task that is not `complete` and whose `END_DT` is before/near today
   (`YYYYMMDD`). Note its `taskId`, `projectId`, title, owner, and due date.
   **Tasks without `END_DT` are invisible to this view** — surface their count separately.
4. **Present** the at-risk list, worst first:
   ```
   ⏰ 마감 점검
   1. "응대 매뉴얼 업데이트"  마감 06-10 (4일 초과)  담당 이XX
   2. "QA 리포트"           마감 06-14 (오늘)       담당 없음
   ```
5. **Offer actions** and confirm before each write:
   - Extend a deadline → `flow.setTaskEndDate(projectId, taskId, "YYYYMMDD")`
   - Bump priority → `flow.setTaskPriority(projectId, taskId, "urgent")`
   - Assign an owner → resolve via `flow.findEmployees(name)` then
     `flow.setTaskWorkers(projectId, taskId, [{ workerId }])` (must be a participant)
   - Move status → `flow.setTaskStatus(projectId, taskId, "progress")`
     (legacy enum `request|progress|feedback|complete|hold`; **Task 2.0 boards** need the
     status option's `optionSrno` from `flow.statusColumn(projectId)` instead — see `API.md`)

## Notes

- Steps 1–4 are read-only. Every fix in step 5 is a real write — confirm each.
- Suggest, don't decide: present options and let the user pick.
