# flow-team-skill

**마드라스체크 [Flow](https://flow.team) Open API를 AI 에이전트가 알아서 쓰게 해주는 스킬 패키지.**

이 저장소 하나를 LLM(Claude Code 등)에게 주면 — Flow의 프로젝트·업무·일정·캘린더·구성원·검색·알림 API를 **읽고**, **만들고/수정하고**, 무엇을 해야 할지 **먼저 제안**합니다. 모든 엔드포인트 스키마와 함정은 실제 API 호출로 검증됐습니다.

> 사용자가 직접 코드를 짤 필요 없습니다. **API 키 한 줄만** 넣으면, 나머지는 에이전트가 합니다.

## 빠른 시작 (3단계)

```bash
# 1. 키 보관 파일 만들기 (이 한 곳에만 넣습니다)
cp .env.example .env

# 2. .env 를 열어 본인 키만 채우기 — 발급: Flow 키관리 페이지
#    FLOW_API_KEY=여기에-본인-키

# 3. 동작 확인
node skills/flow-team/scripts/flow.mjs me
```

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
├── .env.example         ← 복사해서 .env 만들고 키만 채우기
├── .gitignore           ← .env 차단
└── skills/
    └── flow-team/
        ├── SKILL.md            ← 에이전트 행동 지침 (선제안 포함)
        ├── reference/API.md    ← 전 엔드포인트 스키마 + 함정 (실호출 검증)
        ├── scripts/flow.mjs    ← 무의존성 클라이언트 (.env 자동 로드)
        └── examples/           ← 데일리 브리핑 등 레시피
```

## 할 수 있는 일 (요약)

- 📋 내 프로젝트/업무 현황, 칸반 상태 조회
- ✅ 업무 생성·상태/담당자/마감 변경, 게시글·할일·일정 작성
- 📅 캘린더 일정 조회/생성/삭제, 이번 주 일정 브리핑
- 👥 구성원 검색(이름→ID), 프로젝트 참여자 확인
- 🔔 안 읽은 알림 모아보기
- 🤖 위 모든 걸 합쳐 "오늘의 브리핑" 같은 다단계 작업 + **선제안**

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
