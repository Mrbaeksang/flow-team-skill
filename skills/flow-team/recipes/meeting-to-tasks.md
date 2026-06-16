---
id: meeting-to-tasks
title: 회의록 → 업무
what: 회의 노트를 붙여넣으면 액션아이템을 뽑아 담당/마감 달아 업무로 생성
apis: [myProjects, findEmployees, participants, createTask]
mode: write
signals: []
script: null
---

# 회의록 → 업무

## 무엇
회의 노트 → 액션아이템 추출 → 확인 후 프로젝트에 업무 생성.

## 기대효과
- 회의 끝나면 **액션아이템이 자동으로 업무 카드**로 (수기 입력 0)
- 담당/마감까지 달아서 생성 → **바로 추적 가능**
- 누가 어느 업무인지 **이름→ID 자동 매칭**

## 흐름 (API 조합)
1. 대상 프로젝트 선택 — `flow.myProjects()` 또는 사용자에게.
2. 노트에서 액션아이템 추출: 제목 / 설명 / 담당(이름) / 마감.
3. 담당 이름 → id: `flow.findEmployees(name)` → `userId`. 애매하면 물어봄.
4. 표로 보여주고 **확인**.
5. 각 업무 생성 — `flow.createTask(pid, { title, contents, status, priority, endDate, workers })`.
6. 생성 결과의 `tinyUrl` 목록 보고.

## 응답 예시
```
추출된 액션아이템 (확인해주세요):
| 제목                  | 담당   | 마감     |
| 응대 매뉴얼 v2 작성    | 김하늘 | 06-20    |
| QA 시나리오 점검       | (나)   | 06-18    |
당신: "응 만들어"
→ 생성됨: 응대 매뉴얼 v2 (taskId 43346356) https://flow.team/l/Q7PyL
```

## 배운 것 (실호출 검증)
- **status는 영문 enum** `request | progress | feedback | complete | hold` — 한글(대기/진행) 넣으면 안 됨.
- **priority** `low | normal | high | urgent` (내부 저장은 숫자: urgent→3).
- **workers는 프로젝트 참여자여야** — 아니면 `412`. `flow.participants(pid)`로 확인하고 안내.
- 생성 응답 = `{ projectId, postId, taskId, tinyUrl }` (검증). 날짜는 `YYYYMMDD`.

## 안전
- 담당/날짜를 지어내지 말 것 — 노트에 있거나 사용자가 확인한 것만. 5단계 전 4단계 확인 필수.
