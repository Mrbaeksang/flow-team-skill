---
id: daily-report
title: 데일리 보고서 자동발행
what: 브리핑 + 전일 대비 변화를 의사결정형 보고서로 만들어 Flow 프로젝트에 게시
apis: [me, myProjects, tasks/filter, alarms, posts/{postId}, calendars/events, createPost]
mode: write
signals: [openTasks>0]
script: report
---

# 데일리 보고서 자동발행

## Goal
"읽고 판단만" 하는 보고서: 맨 위 **👉 오늘 결정할 것**, 맨 아래 **💡 추천 액션**. 매일 자동 게시.

## Fast path
`node scripts/report.mjs [--dry]` — 게시 대상은 `FLOW_REPORT_PROJECT`(기본 2896369).
스케줄은 [`../SCHEDULING.md`](../SCHEDULING.md) (`npm run schedule:setup`).

## Steps
1. `gatherBrief(today, { deep: true })` — 업무/알림/이번주 일정/담당없음/분포 + 멘션의 원문 글 제목(`flow.post`).
2. `~/.flow-report-snapshot.json`와 비교 → 전일 대비 변화.
3. 결정 큐 + 추천 액션으로 합성 → `flow.createPost(REPORT_PROJECT, { title, contents })`.

## Notes
- 게시는 write — 자동 스케줄로 돌릴 땐 사용자가 한 번 합의해두면 됨.
- 마크다운 렌더 안 되니 평문으로 게시(스크립트가 처리).
