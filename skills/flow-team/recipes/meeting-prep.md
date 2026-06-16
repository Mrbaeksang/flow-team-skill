---
id: meeting-prep
title: 회의 준비
what: 이번 주 회의 일정마다 제목으로 관련 글을 찾아 준비 노트를 모아줌
apis: [calendars/events, search/posts, posts/{postId}]
mode: read
signals: [weekMeetings>0]
script: null
---

# 회의 준비

## 무엇
다가오는 회의 각각에 대해 관련 Flow 글/맥락을 끌어와 "들어가기 전 볼 것"을 정리. 읽기 전용.

## 기대효과
- 회의 전 **관련 자료를 자동 수집** — 따로 검색 안 해도 됨
- 일정 + 관련 글을 **묶어** 회의별 준비 노트로
- 빈손으로 들어가는 회의 방지

## 흐름 (API 조합)
1. `flow.events(이번 주 범위)` → 다가오는 회의들.
2. 각 회의 `eventName`의 핵심 키워드로 `flow.findPosts(keyword)` → 관련 글.
3. 필요하면 `flow.post(postId)`로 본문/결정사항 확인.
4. 회의별로 [일정 + 관련 글 + 핵심 포인트] 정리.

## 응답 예시
```
🗓️ 06-18 (목) 09:30 [AI] 실습형 교육 3차
   관련 글: "[교육] 꿈을 Bora — 3차 커리큘럼" / "2차 피드백 정리"
   체크: 노트북 준비물 공지 발송됐는지
```

## 배운 것 (실호출 검증)
- **검색은 키워드 최소 1자 필수** — 빈 문자열은 `400 VALIDATION_ERROR`. 회의명에서 핵심어를 뽑아 넣을 것.
- `findPosts`는 점수순(`score`) + 페이징(`pageTargetId`) — 상위 몇 개만 봐도 충분.
- `findEvents(keyword, start, end)`로 일정 검색도 가능(키워드 필수).

## 안전
- 읽기 전용.
