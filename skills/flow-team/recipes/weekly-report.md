---
id: weekly-report
title: 주간 리포트
what: 프로젝트별 완료/진행/지연을 종합해 한 주 현황을 요약
apis: [myProjects, tasks/filter, statusColumn]
mode: read
signals: [openTasks>0]
script: null
---

# 주간 리포트

## Goal
무엇이 끝났고, 진행 중이고, 지연됐는지 프로젝트별로 — 읽기 전용.

## Steps
1. `flow.myProjects()` → 활성 프로젝트 몇 개(또는 사용자에게 물어봄).
2. 프로젝트별 `flow.tasks(pid, { pageSize: 100 })` → `columns[]`의 STATUS `optionCategory`로 분류
   (0=대기, 1=진행, 2=완료, 3=보류). `END_DT`로 지연 판정.
3. 완료/진행/지연 버킷으로 프로젝트별 요약.

## Notes
- 읽기 전용. 원문 JSON 빼고 카운트와 핵심만.
- 보고 프로젝트에 게시하려면 `flow.createPost(...)` (확인 후).
