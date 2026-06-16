---
id: assign-ownerless
title: 담당 없는 업무 배정
what: 마감이 임박했는데 담당자가 없는 업무를 찾아 적임자에게 배정 제안
apis: [myProjects, tasks/filter, participants, findEmployees, setTaskWorkers]
mode: write
signals: [ownerless>0]
script: null
---

# 담당 없는 업무 배정

## 무엇
"마감은 다가오는데 아무도 안 맡은" 업무가 새는 걸 막는다.

## 기대효과
- **임박한데 주인 없는 업무**를 자동 발굴 — 책임자/리드에게 특히 유용
- 이름→ID 매칭으로 **배정까지 한 번에**
- 옛날 죽은 업무 노이즈는 빼고 **지금 처리할 것만**

## 흐름 (API 조합)
1. `flow.myProjects()` → 프로젝트.
2. `flow.tasks(pid, { pageSize: 100 })` → `WORKER_ID`가 비었고 미완료이며 `END_DT`가 근시일(오늘~2주)인 업무.
3. 프로젝트별로 묶어 제시 — 제목/마감/프로젝트.
4. 누구에게 배정할지 결정. 이름 → id: `flow.findEmployees(name)`.
5. 확인 후 `flow.setTaskWorkers(pid, taskId, [{ workerId }])`.

## 응답 예시
```
👤 담당 없는 임박 업무 (11건 중 마감순 top 3)
1. 06-16 [LM][PM]담당자 배정 요청 〈[Ent] 엔터AI/LLM 요건〉
2. 06-16 [기능배포]2026/06/16 〈🚨플로우 AI 배포〉
3. 06-16 [모바일][Android]_FLOW_6.4.0 〈[PM] 업데이트〉
당신: "1번 김하늘한테 배정" → findEmployees("김하늘") → setTaskWorkers(...) ✓
```

## 배운 것 (실호출 검증)
- **그냥 "담당없음"은 노이즈 폭탄:** 전 프로젝트로 보면 2018·2019년 죽은 업무까지 94건. **마감 윈도우(오늘~+14)로 한정**하면 10건으로 actionable해짐.
- **담당없음 판정:** task의 `WORKER_ID` 컬럼 `columnData`가 비었으면 담당 없음.
- `setTaskWorkers`는 참여자만 — 아니면 `412`. 먼저 `flow.participants(pid)` 확인(필요시 참여자 추가는 `addParticipants`, 바디 키는 `participantId`).

## 안전
- 배정은 write — 확인 후. 다른 사람을 끌어들이는 작업이니 신중.
