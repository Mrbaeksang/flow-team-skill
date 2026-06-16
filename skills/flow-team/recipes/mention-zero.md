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

## Goal
"나를 부른" 알림을 놓치지 않게: 멘션만 모아 맥락(원문 글)과 함께, 답글 초안까지.

## Steps
1. `flow.alarms()` → `data.alarms.alarms[]` 중 `readYn==="N"` & `mentionYn==="Y"`.
2. 각 멘션의 `postId`로 `flow.post(postId)` → 글 제목/본문 맥락.
3. 우선순위순(최신/중요)으로 제시 — 누가/어디서/무슨 말.
4. (선택) 답글 초안 작성해 사용자에게 보여줌.
5. (선택, 확인 후) 처리한 알림은 `call("PATCH", "/user/alarms/read", { alarmId })`로 읽음 처리.

## Notes
- 답글을 Flow에 직접 게시하는 API는 없음 — 초안은 사용자가 붙여넣음.
- 알림 읽음 처리는 되돌리기 어려움 → 확인 후. `read/all`은 함부로 X.
