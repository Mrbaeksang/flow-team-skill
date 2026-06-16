---
id: meeting-to-tasks
title: 회의록 → 업무
what: 회의 노트를 붙여넣으면 액션아이템을 뽑아 담당/마감 달아 업무로 생성
apis: [myProjects, findEmployees, participants, createTask]
mode: write
signals: []
script: null
---

# 회의록 → 업무

## Goal
회의 노트 → 액션아이템 추출 → 확인 후 프로젝트에 업무 생성.

## Steps
1. 대상 프로젝트 선택 — `flow.myProjects()` 또는 사용자에게.
2. 노트에서 액션아이템 추출: 제목 / 설명 / 담당(이름) / 마감(있으면).
3. 담당 이름 → id: `flow.findEmployees(name)` → `userId`. 애매하면 물어봄.
4. 표로 보여주고 **확인**.
5. 각 업무 생성 — `flow.createTask(pid, { title, contents, status: "request", priority, endDate, workers: [{ workerId }] })`.
   - 날짜 `YYYYMMDD`. 담당은 프로젝트 참여자여야 함(`flow.participants(pid)`로 확인, 아니면 412).
6. 생성 결과의 `tinyUrl` 목록 보고.

## Notes
- 담당/날짜를 지어내지 말 것 — 노트에 있거나 사용자가 확인한 것만.
- 실제 write — 5단계 전 4단계 확인 필수.
