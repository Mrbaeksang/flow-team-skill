---
id: overdue-triage
title: 마감 트리아지
what: 밀린·임박 업무를 찾아 연장 / 재배정 / 완료를 제안하고 실행
apis: [myProjects, tasks/filter, statusColumn, participants, setTaskEndDate, setTaskWorkers, setTaskStatusOption]
mode: write
signals: [overdue>0]
script: null
---

# 마감 트리아지

## 무엇
지나거나 임박한 업무를 짚고, 확인받아 손본다.

## 기대효과
- 밀린 업무가 **새어나가는 걸 방지** — 매번 직접 칸반 뒤질 필요 X
- "연장/배정/완료"를 **말 한마디로** 실행
- 마감 없는 업무 수까지 경고해 **사각지대 제거**

## 흐름 (API 조합)
1. `flow.myProjects()` → 활성 프로젝트.
2. `flow.tasks(pid, { pageSize: 100 })` → `END_DT < 오늘` & 미완료(상태 카테고리 2/3 제외)인 내 업무.
3. 최악순 제시. 마감 없는 업무 수는 따로 경고.
4. 확인 후 실행:
   - 마감 연장 → `flow.setTaskEndDate(pid, taskId, "YYYYMMDD")`
   - 담당 지정 → `flow.findEmployees(name)` → `flow.setTaskWorkers(...)`
   - 상태 변경 → `flow.statusColumn(pid)`에서 optionSrno 찾아 `flow.setTaskStatusOption(...)`

## 응답 예시
```
⏰ 마감 점검 (밀린 1)
1. "레몬베이스 목표 넣어보기 20개" 마감 06-15 (1일 초과) 〈Flow 목표관리〉 [진행]
   → 마감 연장? / 완료처리? / 재배정?
당신: "06-20으로 연장해줘"  → setTaskEndDate(...,"20260620") ✓
```

## 배운 것 (실호출 검증)
- ⚠️ **가장 큰 함정:** `setTaskStatus("progress")`(legacy 문자열)는 신규 보드에서 `success:true`인데 **상태가 안 바뀜(조용한 무반응)**. 반드시 `statusColumn`에서 `optionSrno` 찾아 `setTaskStatusOption` 사용. (라이브 검증: 대기→진행 성공)
- **담당자는 프로젝트 참여자여야** — 아니면 `setTaskWorkers`가 `412`. `flow.participants(pid)`로 확인.
- `setTaskEndDate`는 `YYYYMMDD`(8자리) — 일정/이벤트의 14자리와 다름. (검증됨)

## 안전
- 1~3은 읽기. 4의 각 수정은 실제 write — **항목마다 확인**.
