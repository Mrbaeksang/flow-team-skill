---
id: daily-report-rich
title: 데일리 보고서 리치(이미지) 발행
what: 브리핑 데이터를 한 장의 인포그래픽 PNG로 렌더해 Flow에 이미지로 게시 (본문은 캡션 1줄)
apis: [me, myProjects, tasks/filter, alarms, posts/{postId}, calendars/events, createPost(imageFiles)]
mode: write
signals: [openTasks>0]
script: report
---

# 데일리 보고서 리치(이미지) 발행

## 무엇
`daily-report`의 시각화 버전. 같은 브리핑 데이터를 **헤드리스 Chrome로 HTML→PNG 렌더**해서
Flow 게시글에 **이미지로 첨부**하고, 본문(`contents`)은 한 줄 캡션만 남긴다. "읽는 보고서"가 아니라
"한눈에 보는 대시보드".

한 장에 담기는 패널:
- **KPI 카드 + 어제 대비 ▲▼ 델타** (미완료·밀린·오늘마감·마감없음·담당없음)
- **추세 라인차트** (미완료·밀린 2시리즈, 일별 누적)
- **업무 몰린 프로젝트** 바차트
- **프로젝트 리스크 랭킹 히트맵** (지연×3 + 담당없음×2 + 무기한×1 점수, 색칩)
- **상태 분포** 바 + 범례
- **이번 주 마감 타임라인** (지남 버킷 + 7일 카드)

## 기대효과
- 텍스트 벽 대신 **그림 한 장** → 모바일 Flow에서도 스크롤 없이 파악
- 추세선·델타로 "어제보다 나아졌나"가 즉시 보임
- 리스크 히트맵으로 **위험 프로젝트 우선순위**가 색으로 드러남

## 흐름 (API 조합)
1. `gatherBrief(today, { deep: true })` — 업무/알림/일정/담당없음/분포 (= daily-report와 동일).
2. `~/.flow-report-history.json`에 오늘 지표 1점 upsert → 추세 시리즈. `~/.flow-report-snapshot.json`로 전일 델타.
3. `renderReportChart(d, today, { history, prev })` (`scripts/chart.mjs`) — HTML 인포그래픽을 헤드리스 Chrome
   `--headless=new --screenshot`으로 PNG 렌더 → base64.
4. `flow.createPost(REPORT_PROJECT, { title, contents: 캡션, imageFiles: [{ fileName, fileContents }] })`.

빠른 실행: `node scripts/report.mjs [--dry]` · 게시 대상 `FLOW_REPORT_PROJECT`(기본 2896369) · 스케줄 [`../SCHEDULING.md`](../SCHEDULING.md)

## 응답 예시
```
Posted: https://flow.team/l/Qif8n (postId 79660798, project 2896369) +chart (image-only)
→ GET /user/posts/79660798 → imageAttachments: [1]   # 첨부 확인됨
```

## 배운 것 (실호출 검증)
- **게시글 본문은 평문만** — `contents`는 HTML 입력 불가(읽을 땐 `htmlContent` 필드 있음). 그래서 시각화는
  본문이 아니라 **이미지 첨부**로 해결.
- **`contents`는 필수(min-length 1)** — 이미지만 올려도 빈 본문 불가 → 한 줄 캡션을 넣음.
- **첨부 키는 두 종류** — `imageFiles`(이미지) / `files`(일반). 각 원소 `{ fileName, fileContents(base64) }`.
  PNG는 `iVBORw0KGgo…` base64로 그대로 전송. 첨부 성공 시 조회 응답에 `imageAttachments` 배열로 보임.
- **Chrome 없으면 깨지면 안 됨** — `chart.mjs`는 Chrome 미발견/렌더 실패 시 `null` 반환 → `report.mjs`가
  자동으로 **텍스트 본문(daily-report)로 폴백**. 스케줄 잡이 절대 죽지 않게 best-effort.
- **추세선은 누적식** — 첫 실행은 스냅샷에서 1점 시드 + 오늘 = 2점, 매일 1점씩 쌓여 `~/.flow-report-history.json`(~90일).
- **헤드리스 캡처 크기** = `--window-size`(현재 1240×1560) × `--force-device-scale-factor=2`. 한글은
  시스템 폰트(Apple SD Gothic Neo)로 렌더돼 별도 폰트 임베드 불필요.

## 안전
- 게시는 write — 자동 스케줄 전 사용자 합의 1회. 게시글은 API로 삭제 불가(1건/일 누적).
- 이미지 base64라 글 1건이 수백 KB. `imageFiles`는 1장만 첨부(분량 관리).
