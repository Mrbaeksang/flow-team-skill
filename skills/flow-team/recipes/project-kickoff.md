---
id: project-kickoff
title: 프로젝트 킥오프
what: 새 프로젝트를 만들고 참여자를 넣고 기본 업무 세트를 세팅
apis: [createProject, addParticipants, createTask]
mode: write
signals: []
script: null
---

# 프로젝트 킥오프

## 무엇
새 일을 시작할 때 프로젝트 생성 → 팀 합류 → 기본 업무 골격까지 한 번에.

## 기대효과
- 새 프로젝트 셋업을 **클릭 없이 한 흐름**으로
- 표준 업무 골격(킥오프/기획/실행/리뷰 등)을 **템플릿처럼** 자동 생성
- 팀 합류까지 묶어서 처리

## 흐름 (API 조합)
1. `flow.createProject({ title, description, defaultTab: "task" })` → `projectId`.
2. `flow.addParticipants(projectId, { participants: [{ participantId }] })` (이름 → id는 `findEmployees`).
3. 기본 업무들 `flow.createTask(projectId, { title, contents, status: "request", workers })`.

## 응답 예시
```
"신규 캠페인" 프로젝트 만들까요?
- 참여자: 김하늘, 이도윤
- 기본 업무: 킥오프 / 기획안 / 실행 / 회고
당신: "응"
→ projectId 2905809 생성 · 참여자 2명 · 업무 4건 ✓
```

## 배운 것 (실호출 검증)
- `createProject` 바디: `title`(1~50, 필수)·`description`·`defaultTab`(feed|task|gantt|calendar|file). 응답은 `{ projectId }`만.
- **참여자 추가 바디 키는 `participantId`** (업무 담당의 `workerId`와 다름!). 이미 참여 중이면 `409`.
- ⚠️ **프로젝트는 API 삭제 불가** — 테스트/실험은 이름에 표시. 만든 뒤 정리하려면 Flow 웹에서 아카이브.
- 담당 지정 전 참여자 추가가 선행돼야(업무 담당은 참여자만, 아니면 `412`).

## 안전
- 모두 write이고 프로젝트는 되돌리기 어려움 — 제목/참여자/업무 목록 확인 후 실행.
