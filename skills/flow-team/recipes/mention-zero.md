---
id: mention-zero
title: 멘션 인박스 제로
what: 나를 멘션한 안읽은 알림을 모아 원문과 함께 보여주고 답글 초안 작성/읽음 처리
apis: [alarms, posts/{postId}, alarms/read]
mode: write
signals: [unreadMentions>0]
script: null
---

# 멘션 인박스 제로

## 무엇
"나를 부른" 알림을 놓치지 않게: 멘션만 모아 맥락(원문 글)과 함께, 답글 초안까지.

## 기대효과
- 수십 개 알림 중 **"나를 부른 것"만** 골라 위로 — 놓침 0
- 각 멘션의 **원문 맥락**을 같이 보여줘 바로 답할 수 있음
- 답글 **초안까지** 만들어 복붙만

## 흐름 (API 조합)
1. `flow.alarms()` → `data.alarms.alarms[]` 중 `readYn==="N"` & `mentionYn==="Y"`.
2. 각 멘션의 `postId`로 `flow.post(postId)` → 글 제목/본문 맥락.
3. 우선순위순 제시 — 누가/어디서/무슨 말.
4. (선택) 답글 초안 작성해 사용자에게.
5. (선택, 확인 후) 처리한 알림은 `call("PATCH", "/user/alarms/read", { alarmId })`로 읽음.

## 응답 예시
```
🗣️ 나를 멘션한 안읽은 알림 (2)
1. 이예진 — "오늘 대상자분들 중 참석 어려우면 미리…" 〈[수습일지] 백상현〉
   답글 초안: "넵, 저는 참석 가능합니다. 9시 반에 뵐게요."
2. 손광훈 — "PM실 사용법 공유 부탁드려요" 〈피플 온보딩〉
당신: "1번 읽음 처리해줘" → /user/alarms/read {alarmId} ✓
```

## 배운 것 (실호출 검증)
- **알림 구조가 중첩 + 페이징:** `data.alarms.alarms[]` 에 자체 `{ hasNext, lastCursor }`. cursor로 끝까지 돌아야 다 봄.
- **원문이 알림에 이미 있음:** `alarm.content`에 댓글 텍스트가 들어있어 맥락만 필요하면 `post()` 생략 가능(글 제목이 필요할 때만 호출).
- `mentionYn` / `workerYn` 로 우선순위 — 멘션 먼저, 그다음 내가 담당.
- **답글을 Flow에 직접 거는 API는 없음** → 초안만 제공, 게시는 사용자가.
- `PATCH /user/alarms/read {alarmId}` 검증됨. `read/all`은 인박스 전체 → 신중.

## 안전
- 읽음 처리는 되돌리기 어려움 → 확인 후. `read/all` 함부로 X.
