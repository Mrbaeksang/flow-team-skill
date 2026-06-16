# flow-team-skill

**마드라스체크 [Flow](https://flow.team) Open API를 AI 에이전트가 알아서 쓰게 해주는 스킬 패키지.**

이 저장소 하나를 LLM(Claude Code 등)에게 주면 — Flow의 프로젝트·업무·일정·캘린더·구성원·검색·알림 API를 **읽고**, **만들고/수정하고**, 무엇을 해야 할지 **먼저 제안**합니다. 모든 엔드포인트 스키마와 함정은 실제 API 호출로 검증됐습니다.

> 사용자가 직접 코드를 짤 필요 없습니다. **API 키 한 줄만** 넣으면, 나머지는 에이전트가 합니다.

> 🤖 **비개발자라면:** Claude Code(또는 Codex 등) 에이전트에게 이 레포를 주고 **"이 레포 분석해서 내 Flow 도와줘"** 라고만 하세요. 에이전트는 루트의 [`AGENTS.md`](AGENTS.md)를 읽고 → 스킬을 파악하고 → 키 세팅을 안내한 뒤 → 오늘 브리핑부터 알아서 제안합니다.

> 💡 **별도 결제 없음.** 에이전트 두뇌는 **Claude Code 또는 claude.ai(구독제)** 가 맡습니다. Anthropic API 종량제 키 불필요 — 넣을 키는 본인 **Flow 키 하나뿐**입니다.

## 이렇게 씁니다 — 말 한마디 → 기대효과

| 단계 | AI에게 이렇게 말하면 | 기대효과 |
|---|---|---|
| 0️⃣ **셋업** (한 번) | "이 레포 분석해서 내 Flow 쓰게 도와줘" | 코드 0줄. AI가 `AGENTS.md`→`SKILL.md`를 읽고 **키 세팅까지 안내**. Flow 키 한 줄만 넣으면 끝 (AI는 키를 안 봄). |
| 1️⃣ **조회** | "오늘 브리핑 해줘" | 밀린·오늘마감·임박 업무 + 안읽은 멘션 + 일정을 **한 화면에 30초**로. (`npm run brief`) |
| 2️⃣ **결정→실행** | "밀린 거 마감 연장해줘" · "회의록 붙여넣을게, 업무로 만들어줘" | AI가 읽고 → 제안 → 확인받고 → 업무 생성/연장/상태변경을 **말로** 실행. |
| 3️⃣ **자동화** | "매일 아침 보고서 자동으로 올려줘" | 매일 정해진 시각 **의사결정형 보고서**가 Flow에 게시. 출근하면 "👉 오늘 결정할 것"만 읽고 응/아니. (`npm run schedule:setup`) |

> 🎯 **한 줄 기대효과:** Flow를 직접 들여다보는 대신, 매일 **"오늘 결정할 것"만 읽고 판단**한다. 나머지(조회·생성·수정·집계)는 AI가 한다. 진입장벽은 **Flow 키 한 줄**뿐.

## 빠른 시작 — 키 넣는 법 (셋 중 하나)

**① AI가 파일만 만들고, 키는 AI가 안 읽기 (비개발자 추천)** — 채팅에 키를 노출하기 싫을 때.
> Claude Code에 "Flow 키 넣게 `flow-key.txt` 만들어줘" → 그 파일 열어 **키 붙여넣고 저장** → "이제 세팅해줘"

→ `node setup.mjs`가 `flow-key.txt`를 읽어 `.env`로 옮기고 **txt는 삭제**합니다. **AI는 키 파일을 안 열어서 키를 못 봅니다.** (`flow-key.txt`도 gitignore)

**② 자동 세팅 스크립트** — 터미널에 키 붙여넣기 한 번 (채팅 아님):
```bash
node setup.mjs        # 키 물어보면 붙여넣기 → .env 자동 생성
```

**③ 손으로** — 개발자라면:
```bash
cp .env.example .env  # 그리고 .env 의 FLOW_API_KEY= 뒤에 키 입력
```

확인: `node skills/flow-team/scripts/flow.mjs me` → 내 이름이 나오면 끝.

`.env` 는 `.gitignore` 에 등록돼 있어 **절대 커밋·노출되지 않습니다.** 키를 넣는 곳은 오직 여기 한 곳뿐입니다.

## AI 에이전트에게 주는 법

이 저장소를 작업 폴더로 열고 에이전트에게 이렇게 말하면 됩니다:

> "이 레포의 `skills/flow-team` 스킬을 써서 내 Flow 오늘 할 일 브리핑해줘."

에이전트는 [`AGENTS.md`](AGENTS.md) → [`skills/flow-team/SKILL.md`](skills/flow-team/SKILL.md) 를 읽고 → 필요한 API를 루프로 호출해 상황을 모은 뒤 → **마감 임박 업무·안 읽은 알림·오늘 일정**을 짚어주고 다음 행동을 제안합니다.

> 참고: "이 레포 분석해줘" 식으로 쓰면 위처럼 `AGENTS.md`/`SKILL.md`를 진입점으로 따라갑니다. **Claude Code의 스킬로 영구 등록**하려면 `skills/flow-team` 을 `~/.claude/skills/`(또는 프로젝트 `.claude/skills/`)에 두세요 — 그래야 자동 인식됩니다.

**바로 써보기 (키 세팅 후):**
```bash
npm run brief        # 오늘 데일리 브리핑 한 방 (읽기 전용)
npm run me           # 키 동작 확인 (내 이름 출력)
```

## API 키는 어떻게 안전한가

| | |
|---|---|
| 키를 넣는 곳 | `.env` 의 `FLOW_API_KEY` — **한 곳뿐** |
| 커밋 여부 | `.gitignore` 가 `.env` 차단 → 저장소에 안 들어감 |
| 코드 노출 | 스크립트/스킬 어디에도 키 하드코딩 없음 (`process.env` 로만 읽음) |
| 자동 로드 | `flow.mjs` 가 상위 폴더의 `.env` 를 자동으로 찾아 읽음 |
| 공유 시 | 저장소를 공유해도 키는 안 따라감 (`.env` 는 각자 로컬에서 채움) |

## 구성

```
flow-team-skill/
├── README.md            ← 지금 이 문서
├── setup.mjs            ← 키 붙여넣기 → .env 자동 생성 (비개발자용)
├── .env.example         ← 복사해서 .env 만들고 키만 채우기
├── .gitignore           ← .env 차단
└── skills/
    └── flow-team/
        ├── SKILL.md            ← 에이전트 행동 지침 (선제안 포함)
        ├── reference/API.md    ← 전 엔드포인트 스키마 + 함정 (실호출 검증)
        ├── scripts/flow.mjs    ← 무의존성 클라이언트 (.env 자동 로드)
        ├── scripts/brief.mjs   ← 데일리 브리핑 (node scripts/brief.mjs)
        ├── scripts/report.mjs  ← 의사결정형 보고서 자동발행
        ├── scripts/recommend.mjs ← 내 데이터 기반 맞춤 레시피 추천
        └── recipes/            ← API 조합 "셋" 카탈로그 (frontmatter로 추천 매칭)
```

## 무엇을 만들 수 있나 (레시피 카탈로그)

자연어로 시키면 되는 "셋"들 — 전체 목록은 [`recipes/`](skills/flow-team/recipes/), 카탈로그 설명은 [`recipes/_index.md`](skills/flow-team/recipes/_index.md):

| 레시피 | 한 줄 | 쓰기 |
|---|---|---|
| 📋 [데일리 브리핑](skills/flow-team/recipes/daily-brief.md) | 마감 임박 업무 + 안 읽은 알림 + 오늘 일정 요약 | 읽기 |
| 🤖 [데일리 보고서 자동발행](skills/flow-team/recipes/daily-report.md) | 의사결정형 보고서를 매일 Flow에 게시 | ✍️ |
| 📝 [회의록 → 업무](skills/flow-team/recipes/meeting-to-tasks.md) | 노트 → 액션아이템 → 담당/마감 달아 업무 생성 | ✍️ |
| ⏰ [마감 트리아지](skills/flow-team/recipes/overdue-triage.md) | 밀린 업무 찾아 연장·재배정·완료 제안 | ✍️ |
| 🗣️ [멘션 인박스 제로](skills/flow-team/recipes/mention-zero.md) | 나 멘션한 알림 모아 원문+답글 초안 | ✍️ |
| 👤 [담당 없는 업무 배정](skills/flow-team/recipes/assign-ownerless.md) | 임박한데 담당 없는 업무 찾아 배정 | ✍️ |
| 📊 [주간 리포트](skills/flow-team/recipes/weekly-report.md) · [프로젝트 헬스체크](skills/flow-team/recipes/project-health.md) | 현황 종합 / 위험 프로젝트 | 읽기 |
| 🧍 [스탠드업 봇](skills/flow-team/recipes/standup-bot.md) · 📌 [마감 일괄 부여](skills/flow-team/recipes/bulk-deadline.md) | 3줄 스탠드업 게시 / 마감없는 업무 일괄 부여 | ✍️ |
| 🗓️ [회의 준비](skills/flow-team/recipes/meeting-prep.md) · [일정→준비 업무](skills/flow-team/recipes/schedule-to-task.md) | 회의별 관련글 수집 / 일정→업무 | 읽기·✍️ |
| 🚀 [프로젝트 킥오프](skills/flow-team/recipes/project-kickoff.md) · 📥 [알림→할일](skills/flow-team/recipes/inbox-to-todo.md) | 프로젝트 생성+팀+업무 / 알림→체크리스트 | ✍️ |

> 🎁 **뭘 할지 모르겠으면:** "추천해줘" → `recommend.mjs`가 **내 데이터(밀린·멘션·담당없음…)를 보고 맞는 레시피를 순위로** 제안. 새 레시피는 `recipes/_TEMPLATE.md`로 직접 추가하거나 AI에게 만들어 달라고 하면 됨.

직접 시켜보기 (Claude Code에서):
> "추천해줘 — 내 상황에 뭐가 유용해?"
> "오늘 브리핑 해줘" · "회의록 붙여넣을게, 업무로 만들어줘"

### 능력 요약

- 📋 내 프로젝트/업무 현황, 칸반 상태 조회
- ✅ 업무 생성·상태/담당자/마감 변경, 게시글·할일·일정 작성
- 📅 캘린더 일정 조회/생성/삭제, 이번 주 일정 브리핑
- 👥 구성원 검색(이름→ID), 프로젝트 참여자 확인
- 🔔 안 읽은 알림 모아보기
- 🤖 위 모든 걸 합쳐 다단계 작업 + **선제안**

전체 능력·스키마는 [`skills/flow-team/reference/API.md`](skills/flow-team/reference/API.md) 참고.

## 요건

- Node.js 18+ (전역 `fetch` 사용, 추가 의존성 없음)
- Flow Open API 키 (키관리 페이지에서 발급)

## 보안 주의

- API 키는 비밀입니다. 출력/커밋/스크린샷에 노출 금지 — `.env` 에만.
- 쓰기(생성/수정)는 **실제 워크스페이스에 즉시 반영**됩니다. 게시글/업무/할일/일정은 API로 삭제할 수 없습니다(캘린더 일정만 삭제 가능). 실험은 테스트용 프로젝트에서.
- `PATCH /user/alarms/read/all` 은 알림함 전체를 읽음 처리하니 주의.

## License

MIT
