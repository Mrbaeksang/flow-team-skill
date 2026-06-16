---
id: inbox-to-todo
title: 알림 → 할일
what: 내가 처리해야 할 안읽은 알림을 모아 하나의 할일 체크리스트로 만들어줌
apis: [alarms, myProjects, createTodo]
mode: write
signals: [asWorker>0]
script: null
---

# 알림 → 할일

## 무엇
"내가 담당/처리해야 할" 알림들을 흩어진 채 두지 않고, 한 개의 체크리스트(할일)로 모은다.

## 기대효과
- 안읽은 알림이 **실행 가능한 할일**로 전환 — 잊지 않음
- 흩어진 알림을 **한 체크리스트**로 묶어 처리율 ↑
- 멘션/담당 알림을 행동으로 연결

## 흐름 (API 조합)
1. `flow.alarms()` → `readYn==="N"` 중 `workerYn==="Y"`(내 담당) 또는 `mentionYn==="Y"`.
2. 각 알림을 한 줄 액션으로 요약 → 체크리스트 항목으로.
3. 대상 프로젝트 선택 → `flow.createTodo(pid, { title: "처리할 알림 MM-DD", todoList: [{ contents }, …] })` (확인 후).

## 응답 예시
```
처리할 알림 5건을 할일로 만들까요?
☑ 이예진 댓글 답하기 (수습일지)
☑ Enterprise PM실 사용법 공유
☑ AI 배포 확인
당신: "응, 메모 프로젝트에" → createTodo(2860131, {...}) ✓
```

## 배운 것 (실호출 검증)
- `createTodo` 바디는 **`todoList: [{ contents }]`** (체크리스트 항목) — 평평한 본문이 아님. `title` + `todoList` 필수, 항목 `endDate`(YYYYMMDD) 선택.
- 알림은 `data.alarms.alarms[]` 중첩 + 페이징 → 끝까지 모아 필터.
- `workerYn`/`mentionYn`로 "내 행동이 필요한 것"만 추려야 노이즈 적음.

## 안전
- 할일 생성은 write — 항목 확인 후. 생성 후 알림 읽음 처리는 별도(멘션 인박스 제로 레시피).
