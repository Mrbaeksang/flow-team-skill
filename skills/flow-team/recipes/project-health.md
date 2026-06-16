---
id: project-health
title: 프로젝트 헬스체크
what: 프로젝트별 미완료/지연/담당없음 비율을 집계해 위험한 프로젝트를 짚음
apis: [myProjects, tasks/filter, participants]
mode: read
signals: [projects>3]
script: null
---

# 프로젝트 헬스체크

## Goal
여러 프로젝트 중 어디가 새고 있는지 한눈에 — 관리자/리드용. 읽기 전용.

## Steps
1. `flow.myProjects()` → 전 프로젝트.
2. 각 `flow.tasks(pid, { pageSize: 100 })` → 집계: 미완료 수, 지연(`END_DT<오늘` 미완료) 수, 담당없음 수, 마감없음 수.
3. 프로젝트별 점수/신호등(🔴지연多 / 🟡주의 / 🟢양호)으로 정렬해 위험순 제시.
4. (선택) 위험 프로젝트는 마감 트리아지 / 담당 배정 레시피로 연결.

## Notes
- 읽기 전용. 60개 프로젝트면 호출 많음 → rate limit 자동 재시도가 처리.
