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

## 무엇
"읽고 판단만" 하는 보고서: 맨 위 **👉 오늘 결정할 것**, 맨 아래 **💡 추천 액션**. 매일 자동 게시.

## 기대효과
- 출근하면 보고서가 **Flow에 이미 와 있음** → "오늘 결정할 것"만 읽고 응/아니
- **전일 대비 변화**가 매일 쌓여 추세 보임 (밀림 해소됐나, 알림 늘었나)
- 보고 프로젝트에 올라가니 **팀도 내 현황 공유**

## 흐름 (API 조합)
1. `gatherBrief(today, { deep: true })` — 업무/알림/이번주 일정/담당없음/분포 + 멘션의 원문 글 제목(`flow.post`).
2. `~/.flow-report-snapshot.json`와 비교 → 전일 대비 변화.
3. 결정 큐 + 추천 액션으로 합성 → `flow.createPost(REPORT_PROJECT, { title, contents })`.

빠른 실행: `node scripts/report.mjs [--dry]` · 게시 대상 `FLOW_REPORT_PROJECT`(기본 2896369) · 스케줄 [`../SCHEDULING.md`](../SCHEDULING.md)

## 응답 예시
```
📋 데일리 보고서 — 2026-06-16 (화)
👉 오늘 결정할 것
   1. 🔴 밀린 업무 1건 — 연장 / 완료처리 / 재배정 결정 필요
💬 한 줄: 밀린 1
── 🔥 즉시 처리 / 📅 오늘 / 🟢 이번 주 / 📊 현황 / 🔄 변화 ──
💡 추천 액션: "밀린 거 마감 연장해줘" …
→ Posted: https://flow.team/l/Q7gpV (postId 79196588)
```

## 배운 것 (실호출 검증)
- **Flow 게시글은 마크다운 렌더 안 함** — `#`/`##`/백틱이 날것으로 보임 → 평문으로 변환(`##`→`■`) 후 게시.
- `createPost` 응답 = `{ projectId, postId, tinyUrl }` (검증).
- **deep 모드는 호출 추가** — 멘션마다 `flow.post(postId)` 1콜 → 멘션 많으면 상한(6) 둠.
- **전일 비교는 스냅샷 의존** — 같은 머신이 매일 돌려야 `~/.flow-report-snapshot.json`가 이어짐.

## 안전
- 게시는 write — 자동 스케줄로 돌릴 땐 사용자가 한 번 합의해두면 됨. 게시글은 API로 삭제 불가(평문 1건/일 누적).
