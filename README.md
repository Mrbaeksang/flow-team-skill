# flow-team-skill

**마드라스체크 [Flow](https://flow.team) Open API를 AI 에이전트가 알아서 쓰게 해주는 스킬 패키지.**

이 저장소 하나를 LLM(Claude Code 등)에게 주면 — Flow의 프로젝트·업무·일정·캘린더·구성원·검색·알림 API를 **읽고**, **만들고/수정하고**, 무엇을 해야 할지 **먼저 제안**합니다. 모든 엔드포인트 스키마와 함정은 실제 API 호출로 검증됐습니다.

> 사용자가 직접 코드를 짤 필요 없습니다. **API 키 한 줄만** 넣으면, 나머지는 에이전트가 합니다.

> 💡 **별도 결제 없음.** 에이전트 두뇌는 **Claude Code 또는 claude.ai(구독제)** 가 맡습니다. Anthropic API 종량제 키 불필요 — 넣을 키는 본인 **Flow 키 하나뿐**입니다.

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

에이전트는 [`skills/flow-team/SKILL.md`](skills/flow-team/SKILL.md) 를 읽고 → 필요한 API를 루프로 호출해 상황을 모은 뒤 → **마감 임박 업무·안 읽은 알림·오늘 일정**을 짚어주고 다음 행동을 제안합니다. (Claude Code면 `skills/` 가 자동 인식됩니다.)

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
        ├── scripts/brief.mjs   ← 데일리 브리핑 한 방 실행 (node scripts/brief.mjs)
        └── examples/           ← 데일리 브리핑·회의록→업무·주간리포트·마감트리아지
```

## 무엇을 만들 수 있나 (워크플로 예시)

이 스킬을 얹은 클로드한테 자연어로 시키면 되는 것들 — 레시피는 [`examples/`](skills/flow-team/examples/)에:

| 워크플로 | 한 줄 | 쓰기 |
|---|---|---|
| 📋 [데일리 브리핑](skills/flow-team/examples/daily-brief.md) | 마감 임박 업무 + 안 읽은 알림 + 오늘 일정 요약 | 읽기 |
| 📝 [회의록 → 업무](skills/flow-team/examples/meeting-to-tasks.md) | 노트 붙여넣기 → 액션아이템 추출 → 담당자/마감 달아 업무 생성 | ✍️ |
| 📊 [주간 리포트](skills/flow-team/examples/weekly-report.md) | 프로젝트별 완료/진행/지연 종합 | 읽기 |
| ⏰ [마감 트리아지](skills/flow-team/examples/overdue-triage.md) | 지난 업무 찾아 연장·재배정·알림 제안 | ✍️ |

직접 시켜보기 (Claude Code에서):
> "이 스킬로 내 Flow 오늘 브리핑 해줘"
> "회의록 붙여넣을게, 액션아이템 업무로 만들어줘"

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
