---
id: overdue-triage
title: 마감 트리아지
what: 밀린·임박 업무를 찾아 연장 / 재배정 / 완료를 제안하고 실행
apis: [myProjects, tasks/filter, statusColumn, participants, setTaskEndDate, setTaskWorkers, setTaskStatusOption]
mode: write
signals: [overdue>0]
script: null
---

# 마감 트리아지

## Goal
지나거나 임박한 업무를 짚고, 확인받아 손본다.

## Steps
1. `flow.myProjects()` → 활성 프로젝트.
2. `flow.tasks(pid, { pageSize: 100 })` → `END_DT < 오늘` & 미완료(상태 카테고리 2/3 제외)인 내 업무. taskId/제목/담당/마감 기록.
3. 최악순 제시. 마감 없는 업무 수는 따로 경고.
4. 확인 후 실행:
   - 마감 연장 → `flow.setTaskEndDate(pid, taskId, "YYYYMMDD")`
   - 담당 지정 → `flow.findEmployees(name)` → `flow.setTaskWorkers(...)` (참여자여야 함, 아니면 412)
   - 상태 변경 → `flow.statusColumn(pid)`에서 optionSrno 찾아 `flow.setTaskStatusOption(...)` (legacy status 문자열은 신규 보드에서 무시됨)

## Notes
- 1~3은 읽기. 4의 각 수정은 실제 write — 항목마다 확인.
