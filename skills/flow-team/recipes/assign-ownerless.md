---
id: assign-ownerless
title: 담당 없는 업무 배정
what: 마감이 임박했는데 담당자가 없는 업무를 찾아 적임자에게 배정 제안
apis: [myProjects, tasks/filter, participants, findEmployees, setTaskWorkers]
mode: write
signals: [ownerless>0]
script: null
---

# 담당 없는 업무 배정

## Goal
"마감은 다가오는데 아무도 안 맡은" 업무가 새는 걸 막는다.

## Steps
1. `flow.myProjects()` → 프로젝트.
2. `flow.tasks(pid, { pageSize: 100 })` → `WORKER_ID`가 비었고 미완료이며 `END_DT`가 근시일(오늘~2주)인 업무.
3. 프로젝트별로 묶어 제시 — 제목/마감/프로젝트.
4. 누구에게 배정할지 사용자에게(또는 추천). 이름 → id: `flow.findEmployees(name)`.
5. 확인 후 `flow.setTaskWorkers(pid, taskId, [{ workerId }])` (참여자여야 함, 아니면 412 → `flow.participants(pid)` 확인).

## Notes
- 옛날 죽은 업무 노이즈를 피하려 마감 윈도우(오늘~+14)로 한정.
- 배정은 write — 확인 후.
