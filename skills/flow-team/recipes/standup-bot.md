---
id: standup-bot
title: 스탠드업 봇
what: 진행중 / 오늘 할 것 / 막힌 것을 3줄 스탠드업으로 정리해 팀 프로젝트에 게시
apis: [myProjects, tasks/filter, createPost]
mode: write
signals: [openTasks>0]
script: null
---

# 스탠드업 봇

## 무엇
데일리 스탠드업 형식("오늘 할 것 / 진행 중 / 막힌 것")을 자동으로 만들어 팀 글로 올린다.

## 기대효과
- 매일 **스탠드업 작성 0손** — 업무 상태에서 자동 생성
- 팀이 내 진행/블로커를 **한눈에** 공유
- 데일리 보고서(나용)와 달리 **팀 공유용 3줄 요약**

## 흐름 (API 조합)
1. `flow.myProjects()` → 내 프로젝트.
2. `flow.tasks(pid)` → 내 담당을 상태로 분류: 진행 중(카테고리 1) / 오늘·임박 마감(`END_DT`) / 막힌 것(보류 카테고리 3).
3. 3줄로 합성 → `flow.createPost(teamProjectId, { title: "스탠드업 MM-DD", contents })` (확인 후).

## 응답 예시
```
🧍 스탠드업 — 06-16 (백상현)
• 오늘 할 것: 레몬베이스 목표 20개(오늘마감) · Enterprise PM실 사용법
• 진행 중: AI 교육 3차 준비
• 막힌 것: (선양소주) 인사이트 대시보드 — 보류, 재개 결정 필요
→ Posted: https://flow.team/l/XXXX
```

## 배운 것 (실호출 검증)
- "어제 한 것"은 API로 바로 못 뽑음(완료 시각 이력 없음) → **현재 상태 기준**(오늘/진행/막힘)으로 정직하게 구성.
- 상태 분류는 `optionCategory`(1=진행, 3=보류)가 보드 무관하게 안전.
- 게시 대상 팀 프로젝트 id는 사용자에게 한 번 확인(또는 `FLOW_REPORT_PROJECT`류 환경변수).

## 안전
- 게시는 write — 팀이 보는 글이니 내용 확인 후. 게시글 삭제 API 없음.
