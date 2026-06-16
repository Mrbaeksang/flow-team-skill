---
id: schedule-to-task
title: 일정 → 준비 업무
what: 다가오는 회의/일정마다 준비용 업무를 만들어 마감을 일정 전날로 설정
apis: [calendars/events, myProjects, participants, createTask]
mode: write
signals: [weekMeetings>0]
script: null
---

# 일정 → 준비 업무

## 무엇
캘린더 일정을 "준비 업무"로 떨어뜨려, 회의가 그냥 지나가지 않게 한다.

## 기대효과
- 회의/마일스톤마다 **준비 업무가 자동 생성** → 추적 가능
- 마감을 **일정 전날**로 잡아 미리 챙김
- 캘린더와 업무 보드를 **연결**

## 흐름 (API 조합)
1. `flow.events(이번 주 범위)` → 일정 목록. 어떤 일정에 준비가 필요한지 사용자와 선택.
2. 대상 프로젝트 선택(`flow.myProjects()`), 담당 참여자 확인(`flow.participants`).
3. 각 일정 → `flow.createTask(pid, { title: "[준비] {일정명}", contents, status, endDate: 전날, workers })`.

## 응답 예시
```
이번 주 일정 중 준비 업무 만들까요?
☑ 06-18 [AI] 실습형 교육 3차 → "[준비] 교육 3차 자료" 마감 06-17
당신: "응" → createTask(...) ✓ https://flow.team/l/XXXX
```

## 배운 것 (실호출 검증)
- 일정 날짜는 14자리(`eventStartDateTime`), 업무 마감은 8자리(`YYYYMMDD`) — **변환 필요**(앞 8자리).
- `createTask` status는 영문 enum, workers는 참여자만(아니면 `412`).
- 일정이 많으면 업무도 많이 생김 → 어떤 일정에 만들지 **선택받고** 진행.

## 안전
- 업무 생성은 write — 어떤 일정에 만들지 확인 후. 업무 삭제 API 없음.
