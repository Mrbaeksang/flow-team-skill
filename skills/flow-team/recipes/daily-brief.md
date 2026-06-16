---
id: daily-brief
title: 데일리 브리핑
what: 밀린·오늘마감·임박 업무 + 안읽은 멘션 + 오늘 일정을 한 화면에
apis: [me, myProjects, tasks/filter, alarms, calendars/events]
mode: read
signals: [openTasks>0]
script: brief
---

# 데일리 브리핑

## Goal
아침에 읽는 짧은 현황: 챙길 업무·알림·일정. 읽기 전용.

## Fast path
`node scripts/brief.mjs [YYYYMMDD]` — 1~5단계를 그대로 실행해 합성 브리핑을 출력.

## Steps
1. `flow.me()` / `flow.myProjects()` — 신원 + 내 프로젝트.
2. 각 프로젝트 `flow.tasks(pid)` → `columns[]` 파싱(TASK_NM/STATUS/WORKER_ID/END_DT). 내 담당만, `END_DT`로 밀림/오늘/임박 분류. (마감 없는 건 별도 카운트)
3. `flow.alarms()` → `readYn==="N"`, `mentionYn==="Y"` 우선.
4. `flow.events(오늘 00~23:59)` → 오늘 일정.
5. 합쳐 요약 + 다음 행동 제안.

## Notes
- 원문 JSON은 빼고 요약. 쓰기 없음.
