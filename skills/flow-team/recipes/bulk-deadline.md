---
id: bulk-deadline
title: 마감 일괄 부여
what: 마감일 없는 미완료 업무를 모아 일괄로 마감일을 제안/설정
apis: [myProjects, tasks/filter, setTaskEndDate]
mode: write
signals: [noDeadline>5]
script: null
---

# 마감 일괄 부여

## Goal
"마감 없는 업무"는 모든 마감 기준 판단에서 새어나간다. 한 번에 마감을 붙여 레이더에 올린다.

## Steps
1. `flow.myProjects()` → 프로젝트.
2. `flow.tasks(pid, { pageSize: 100 })` → 내 담당, 미완료, `END_DT` 없는 업무 목록.
3. 묶어서 제시하고 마감 제안(예: 1주 뒤, 또는 프로젝트별 일괄). 사용자가 조정.
4. 확인 후 각 `flow.setTaskEndDate(pid, taskId, "YYYYMMDD")`.

## Notes
- 한꺼번에 많이 바꾸는 write — 목록 확인 후 진행. 되돌리려면 다시 설정해야 함.
