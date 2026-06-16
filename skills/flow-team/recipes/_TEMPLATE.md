---
id: my-recipe                      # unique slug (filename without .md)
title: 내 레시피 이름
what: 한 줄로 무엇을 하는지
apis: [myProjects, tasks/filter]   # combined Flow calls (see reference/API.md)
mode: read                         # read | write  (write = changes the workspace → confirm first)
signals: [overdue>0]               # when it's useful; keys from scripts/profile.mjs. [] = always/on-demand
script: null                       # npm script name if you also add a runnable script, else null
---

# 내 레시피 이름

## 무엇
무엇을, 누구를 위해. 한두 줄.

## 기대효과
- 이걸 쓰면 사용자가 얻는 구체적 가치 (시간 절약, 놓침 방지, 판단만 하게 등)

## 흐름 (API 조합)
1. `flow.myProjects()` → …
2. `flow.tasks(projectId, { pageSize: 100 })` → `columns[]` 파싱(TASK_NM/STATUS/WORKER_ID/END_DT)
3. 합쳐서 정리/제안.

## 응답 예시
```
사용자가 실제로 보게 될 출력 샘플 (간결하게)
```

## 배운 것 (실호출 검증)
- 이 레시피를 쓸 때 실제로 부딪히는 함정/주의 (rate limit, 필드 형식, 412 등)

## 안전
- read 단계까지 안전. write는 실행 전 확인. id는 read에서 resolve(추측 금지).
