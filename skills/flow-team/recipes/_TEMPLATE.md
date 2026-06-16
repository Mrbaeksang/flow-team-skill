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

## Goal
무엇을, 누구를 위해.

## Steps
1. `flow.myProjects()` → …
2. `flow.tasks(projectId, { pageSize: 100 })` → … (parse `columns[]`: TASK_NM/STATUS/WORKER_ID/END_DT)
3. 합쳐서 정리/제안.

## Notes
- read 단계까지 안전. write는 실행 전 확인.
- 담당자/프로젝트 id는 read에서 resolve (추측 금지).
