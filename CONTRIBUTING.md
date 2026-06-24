# flow-team-skill 기여 가이드

Flow 에이전트 스킬을 함께 다듬어 주셔서 감사합니다! 이 레포는 의도적으로 작고 의존성이 없습니다 —
기여도 그 원칙을 지켜 주세요.

## 기본 원칙

- **비밀값을 절대 커밋하지 마세요.** API 키는 로컬 `.env`(gitignore 대상)에만 둡니다. 실제 키를
  파일·이슈·PR에 붙여 넣었다면 즉시 Flow **키관리** 페이지에서 재발급하세요.
- **의존성 0을 유지하세요.** `scripts/flow.mjs`는 Node 18+ 내장 기능만 씁니다. 충분한 이유와
  이슈에서의 사전 논의 없이 npm 의존성을 추가하지 마세요.
- **실제 API로 검증하세요.** 엔드포인트를 추가/변경하면 실호출로 요청·응답 형태를 확인하고
  `reference/API.md`에 ✅로 표시하세요. 쓰기 작업은 버리는 테스트 프로젝트에서 하세요.

## 개발 환경 준비

```bash
git clone https://github.com/Mrbaeksang/flow-team-skill.git
cd flow-team-skill
cp .env.example .env          # Flow API 키 붙여넣기
npm run check                 # 클라이언트 문법 검사
npm run me                    # 실제 연결 스모크 테스트 (유효한 키 필요)
```

빌드 단계는 없습니다 — 순수 ES 모듈입니다.

## 변경 작업 흐름

1. 변경할 내용을 설명하는 이슈를 먼저 엽니다 (버그·새 엔드포인트·문서 수정).
2. `main`에서 브랜치를 땁니다: `git switch -c feat/short-description`.
3. 편집은 한 가지에 집중합니다. 기존 스타일(작은 함수, 명확한 이름)을 따릅니다.
4. API 표면을 건드렸다면:
   - `skills/flow-team/reference/API.md` 갱신 (스키마 + 상태 표시).
   - 편의 메서드가 어울리면 `skills/flow-team/scripts/flow.mjs` 갱신.
   - `CHANGELOG.md`의 "Unreleased"에 변경 내용 기록.
5. 푸시 전에 `npm run check` 실행.
6. PR 템플릿으로 PR을 열고 이슈를 연결합니다.

## 커밋 메시지

`feat:`, `fix:`, `docs:`, `refactor:`, `chore:` 같은 컨벤셔널 접두사를 권장합니다.
본문은 한글로 작성해 주세요.

## 범위

이 레포는 AI 에이전트를 위해 **Flow Open API**를 감쌉니다. 여기 들어갈 것: 엔드포인트 커버리지,
스키마 정확성, 클라이언트 헬퍼, 에이전트 가이드(SKILL.md), 레시피. 들어가지 않을 것:
앱 고유 비즈니스 로직, UI, 키를 함께 묶는 모든 것.
