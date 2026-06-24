# 변경 이력

이 프로젝트의 주요 변경 사항을 여기에 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)를 따르며,
버전은 [유의적 버전(Semantic Versioning)](https://semver.org/spec/v2.0.0.html)을 준수합니다.

## [Unreleased]

### 변경 (크로스 플랫폼: Windows / macOS / Linux 동일 동작)
- `scripts/schedule-setup.mjs`가 이제 **OS를 자동 감지**해 맞는 스케줄러를 출력합니다:
  **launchd**(macOS, 기존), **cron**(Linux), **schtasks / 작업 스케줄러**(Windows).
  이전엔 macOS 전용이었습니다. 각 출력에는 해당 OS의 즉시 테스트·나중 제거 명령이 포함됩니다.
- `npm run check`가 bash `for` 루프를 Node 러너(`check.mjs`)로 대체 — 모든 `.mjs`를 재귀적으로
  문법 검사하며 Windows(cmd/PowerShell)·macOS·Linux에서 동일하게 동작합니다.
- CI `check` 잡이 이제 3-OS 매트릭스(ubuntu/windows/macos × Node 18/20/22)에서 돌아 스크립트
  이식성을 증명합니다. Unix 전용 비밀값 가드는 별도 ubuntu 잡으로 분리됐습니다.

### 추가
- SKILL.md "어디서 실행되나(크로스 플랫폼)" — 에이전트가 환경을 먼저 감지하도록 안내:
  `.mjs` 스크립트는 순수 Node(어디서나 실행), 스케줄링은 OS별(schedule-setup이 처리), 로컬 셸이 없는
  앱/웹 환경에선 API를 직접 호출하고 launchd/cron 대신 클라우드 루틴을 쓰라는 내용.
- SCHEDULING.md에 OS 지원 매트릭스를 추가하고 로컬 스케줄러 3종을 옵션 A로 통합했습니다.

## [0.4.1] - 2026-06-16

### 추가
- 레시피 5개 추가(카탈로그 총 14개): `standup-bot`, `meeting-prep`, `schedule-to-task`,
  `project-kickoff`, `inbox-to-todo` — 덜 쓰이던 API(search/findPosts, createTodo,
  createProject + addParticipants, calendar→task)를 활용. `recommend.mjs`가 자동으로 수집합니다.
  각 카드에 기대효과 / 응답 예시 / 실호출로 검증한 함정 포함.
- 모든 레시피 카드를 무엇 / 기대효과 / 흐름 / 응답 예시 / 배운 것(실호출 검증) / 안전으로 보강.

## [0.4.0] - 2026-06-16

### 추가
- 레포 루트에 `AGENTS.md` + `CLAUDE.md` — "레포를 클론해서 분석해줘"라고 들은 에이전트가 스스로
  온보딩하도록 하는 진입점 지침: `SKILL.md`를 읽고, 키 세팅을 안내하고, `npm run brief`로 가치를
  먼저 보여주고, 선제적으로 행동. 비개발자의 "이거 분석해줘" 흐름을 겨냥.

### 추가
- `skills/flow-team/scripts/report.mjs` — 결정론적 데일리 자동 보고서: 브리핑을 만들고 전일
  스냅샷(`~/.flow-report-snapshot.json`)과 비교한 뒤 보고 프로젝트(`FLOW_REPORT_PROJECT`,
  기본 `2896369`)에 게시. `npm run report` (`--dry`로 미리보기).
- `brief.mjs`를 리팩터해 `gatherBrief()` / `renderBrief()`를 export — `report.mjs`와 에이전트가
  같은 수집 로직을 재사용(중복 산출 제거).

### 수정
- `report.mjs`가 이제 깔끔한 평문으로 게시 — Flow 게시글은 마크다운을 렌더하지 않아 `#`/`##`/백틱이
  날것으로 보이던 문제 해결.

### 추가 (레시피 카탈로그 + 추천 엔진)
- `skills/flow-team/recipes/` — API 조합 "셋" 카탈로그. 각 카드에 기계가 읽는 frontmatter
  (`apis`, `mode`, `signals`, `script`). 9개로 시작: daily-brief, daily-report, weekly-report,
  overdue-triage, meeting-to-tasks, mention-zero, assign-ownerless, project-health, bulk-deadline
  — 그리고 직접 작성을 위한 `_index.md`와 `_TEMPLATE.md`.
- `scripts/profile.mjs` — 사용자 키에서 신호(overdue, unreadMentions, ownerless, noDeadline,
  projects, weekMeetings…)를 계산. `npm run profile`.
- `scripts/recommend.mjs` — 레시피 `signals`를 프로필과 매칭해 실제 수치와 함께 긴급도 순위
  맞춤 목록을 출력. `npm run recommend`.
- SKILL.md "추천 모드"; README/AGENTS가 카탈로그를 가리킴.
- `examples/` → `recipes/`로 이전(구조화 카드).

### 변경 (보고서 보강)
- `report.mjs`가 이제 **결정 우선 임원 브리핑**: 상단 "오늘 결정할 것" 큐 + 하단 "추천 액션" 목록,
  여기에 이번 주 캘린더, 업무 분포, 상태 분포, 임박한 미배정 업무, 그리고 멘션이 달린 글까지
  보강(`flow.post`).
- `brief.mjs`의 `gatherBrief()`에 `{ deep }` 추가, 상태 `optionCategory`(2=완료/3=보류)로 정확한
  완료 판정, 주간 일정, 분포, 범위 한정 미배정 업무.
- 429 재시도 수정이 **조용한 누락 집계도 해결**함을 드러냄 — 레이트리밋된 프로젝트 스캔이
  건너뛰어져 열린 업무가 과소 집계되던 문제. 이제 전체 스캔이 정확한 수치를 보고.

### 추가 (견고성 & 스케줄링)
- `flow.mjs`의 `call()`이 `429`(레이트리밋)에서 백오프로 자동 재시도 — ~60콜짜리 브리핑/보고서와
  무인 스케줄 실행이 일시적 한도에 걸려 실패하지 않게.
- `scripts/schedule-setup.mjs` (`npm run schedule:setup`) — 데일리 보고서를 정해진 시각에 돌리는
  macOS launchd 잡을(올바른 절대 경로로) 바로 설치 가능하게 출력. 출력만 하며 시스템은 건드리지 않음.
- `SCHEDULING.md` — launchd(로컬) vs 클라우드 루틴, 레이트리밋·스냅샷 참고.

### 변경
- **쓰기 엔드포인트를 API로 실검증**(createProject/Task/Todo/Schedule/Event, update/deleteEvent,
  업무 날짜·우선순위 PATCH, addParticipants) — `createPost`로 실제 데일리 보고서 게시 포함.
- **분당 120 요청 레이트리밋**(`429`) 문서화; 전체 브리핑/보고서가 ~60콜 이상이라 연속 실행 시 걸림.
- **상태 PATCH 함정(검증):** 현재 보드에서 레거시 `{ status }` 문자열은 성공을 반환하지만 조용히
  무효 처리됨 — `{ optionSrno }`를 보내야 함. 문서는 이제 `optionSrno` / `setTaskStatusOption`을
  앞세우고, `overdue-triage.md`는 `setTaskStatus`보다 이를 권장.
- `deleteEvent`의 srno 조회 특이점 문서화(삭제는 범위 조회로 확인).

### 수정
- README가 더 이상 맨 `skills/` 폴더가 자동 인식된다고 주장하지 않음; Claude Code 스킬 자동 인식은
  `~/.claude/skills/`(또는 프로젝트 `.claude/skills/`)가 필요하고, "이 레포 분석해줘" 흐름은
  `AGENTS.md`/`SKILL.md`로 동작함을 문서화.

## [0.3.0] - 2026-06-15

### 추가
- `skills/flow-team/scripts/brief.mjs` — 원샷 데일리 브리핑(밀린/오늘/임박 업무 + 멘션 우선
  안읽은 알림 + 오늘 일정), 자동 날짜, 읽기 전용. `npm run brief`.
- `skills/flow-team/reference/API-FULL.md` — 개발자 포털에서 스크랩한 전체 39개 User-API
  엔드포인트의 요청/응답/에러 스키마 원문.
- 그동안 빠졌던 엔드포인트의 `flow.mjs` 클라이언트 래퍼: `divisions`(GET),
  `updateEvent`(PATCH 캘린더 이벤트), `createProject`, `addParticipants`; CLI에 `divisions` 추가.

### 변경
- `API.md`: 검증된 업무 `columns[]` 파싱 레시피(TASK_NM/STATUS/WORKER_ID/END_DT) 추가,
  `GET /user/divisions` 문서화, 캘린더 이벤트 업데이트 PATCH, `POST /user/projects` 및
  `.../participants`의 검증된 쓰기 본문(키는 `participantId`), Task 2.0 `optionSrno` 상태 경로
  (`status`와 상호 배타), 검증된 `alarms/read` 본문.
- `npm run check`가 이제 `setup.mjs`와 `brief.mjs`도 문법 검사(이전엔 `flow.mjs`만).

### 참고
- 듬성한 업무 마감일: 일부 업무만 `END_DT`를 가짐; 마감 기반 뷰는 전체를 다 보는 척하지 말고
  "마감 없음" 수를 반드시 함께 노출해야 함.

## [0.2.0] - 2026-06-14

### 추가
- `setup.mjs` — 비개발자용 대화식 원스텝 API 키 세팅(키 붙여넣기 → `.env` 작성); `npm run setup`.
- 워크플로 레시피: `meeting-to-tasks.md`, `weekly-report.md`, `overdue-triage.md`
  (`daily-brief.md`에 합류).
- README "무엇을 만들 수 있나" 섹션과 비개발자 키 세팅 경로(AI에게 시키거나 `setup.mjs`).

### 변경
- 에이전트 런타임이 Claude Code / claude.ai(구독제)임을 명확히 — Anthropic API 종량 결제 키
  불필요; 유일한 비밀값은 사용자의 Flow 키.

## [0.1.0] - 2026-06-14

### 추가
- 초기 Flow Open API 에이전트 스킬 패키지.
- `skills/flow-team/SKILL.md` — 점진적 공개와 선제적("Hermes") 업무 방식의 에이전트 가이드.
- `skills/flow-team/reference/API.md` — 전체 엔드포인트 레퍼런스(프로젝트, 구성원, 게시글/업무,
  캘린더, 검색, 알림) + 요청/응답 스키마, 실검증 완료.
- `skills/flow-team/scripts/flow.mjs` — 무의존성 Node 18+ 클라이언트: `.env` 자동 로드,
  응답 봉투 언래핑, 커서 페이징, 소형 CLI.
- `skills/flow-team/examples/daily-brief.md` — 데일리 브리핑 레시피(수집 → 합성 → 제안).
- `.env` / `.env.example`를 통한 단일 위치·gitignore API 키 보관.
- 표준 레포 골격: README, LICENSE(MIT), CONTRIBUTING, SECURITY, CODE_OF_CONDUCT,
  이슈/PR 템플릿, CI.

[Unreleased]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Mrbaeksang/flow-team-skill/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Mrbaeksang/flow-team-skill/releases/tag/v0.1.0
