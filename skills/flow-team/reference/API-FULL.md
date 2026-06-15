# Flow User API — full endpoint schemas (scraped from docs)

Base-path: https://api.flow.team


---

# User Projects

## GET /user/projects 프로젝트 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
cursor string 0 페이징 커서 (page size: 500)
Constraints
accept: 숫자
default: 0

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean true 다음 정보 여부
lastCursor* number 100 마지막 커서 정보
projects* array - 프로젝트 정보
Parameter Type Example Description
projectId* string 123000 프로젝트ID
title* string [문의] 고객문의 프로젝트 프로젝트 이름
projectUrl* string https://flow.team/main.act?projectId=123000 프로젝트 URL
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "message": "success",
6 
 "data": {
7 
 "hasNext": true,
8 
 "lastCursor": 4,
9 
 "projects": [
10 
 {
11 
 "projectId": "123000",
12 
 "title": "[문의] 고객문의 프로젝트",
13 
 "projectUrl": "https://flow.team/main.act?projectId=123000"
14 
 },
15 
 {
16 
 "projectId": "123001",
17 
 "title": "[공유] 개발 진행상황 공유",
18 
 "projectUrl": "https://flow.team/main.act?projectId=123001"
19 
 },
20 
 {
21 
 "projectId": "123002",
22 
 "title": "[개발] 신규 프로젝트 관리",
23 
 "projectUrl": "https://flow.team/main.act?projectId=123002"
24 
 }
25 
 ]
26 
 }
27 
 }
28 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/projects/participants 내가 참여중인 프로젝트 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - -
Parameter Type Example Description
projects* array - API 응답 데이터
Parameter Type Example Description
projectId* string 123000 프로젝트ID
title* string [문의] 고객문의 프로젝트 프로젝트 이름
projectUrl* string https://flow.team/main.act?projectId=123000 프로젝트 URL
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "message": "success",
6 
 "data": {
7 
 "projects": [
8 
 {
9 
 "projectId": "123000",
10 
 "title": "[문의] 고객문의 프로젝트",
11 
 "projectUrl": "https://flow.team/main.act?projectId=123000"
12 
 },
13 
 {
14 
 "projectId": "123002",
15 
 "title": "[개발] 신규 프로젝트 관리",
16 
 "projectUrl": "https://flow.team/main.act?projectId=123002"
17 
 }
18 
 ]
19 
 }
20 
 }
21 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/projects/{projectId} 프로젝트 단일 상세 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 사용자 API Key
Path Parameters
Parameter Type Example Description
projectId* string 317938 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - 프로젝트 상세 데이터
Parameter Type Example Description
project object - 프로젝트 상세 원본 데이터
Parameter Type Example Description
PROJECT_SETTING array - 프로젝트 기본 설정 목록
Parameter Type Example Description
COLABO_SRNO* string 317938 프로젝트 ID
TTL* string 고객 문의 프로젝트 프로젝트 제목
CNTN string 고객 문의와 처리 상태를 관리하는 프로젝트입니다. 프로젝트 설명
USE_INTT_ID string BFLOW_300000388612 이용기관 ID
SENDIENCE_CNT string 12 참여자 수
OPEN_YN string N 공개 프로젝트 여부
HOME_TAB_CODE string FEED 프로젝트 홈 탭 코드
STATUS string 프로젝트 상태
RGSN_DTTM string 20260422174401 등록 일시
RGSR_ID string flow@flow.team 등록자 ID
RGSR_NM string 홍길동 등록자 이름
PROJECT_COLUMN_REC array - 프로젝트 업무 컬럼 목록
OPTION_REC array - 프로젝트 컬럼 옵션 목록
PIN_RECORD array - 상단 고정 글 목록
TAG_RECORD array - 프로젝트 태그 목록
ALARM_RECORD array - 알림 목록
ALARM_COUNT string 3 알림 수
ALARM_MORE_YN string N 알림 추가 조회 가능 여부
TASK_REPORT_RECORD array - 업무 리포트 목록
CUSTOM_STATUS_TASK_REPORT_RECORD array - 커스텀 상태 업무 리포트 목록
JOIN_APPLY_RECORD array - 참여 신청 목록
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "project": {
9 
 "PROJECT_SETTING": [
10 
 {
11 
 "COLABO_SRNO": "317938",
12 
 "TTL": "고객 문의 프로젝트",
13 
 "CNTN": "고객 문의와 처리 상태를 관리하는 프로젝트입니다.",

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/projects/{projectId}/participants 프로젝트 참여자 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
participants* array - 참여자 정보
Parameter Type Example Description
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자ID
name* string 플로우 사용자 이름
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "message": "success",
6 
 "data": {
7 
 "participants": [
8 
 {
9 
 "inttId": "BFLOW_000000001234",
10 
 "userId": "flow@flow.team",
11 
 "name": "플로우"
12 
 },
13 
 {
14 
 "inttId": "BFLOW_000000001234",
15 
 "userId": "morningmate@flow.team",
16 
 "name": "모닝메이트"
17 
 },
18 
 {
19 
 "inttId": "BFLOW_000000001234",
20 
 "userId": "flokki@flow.team",
21 
 "name": "플로끼"
22 
 }
23 
 ]
24 
 }
25 
 }
26 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/projects/{projectId}/columns 프로젝트 컬럼 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 317536 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 317536 프로젝트 ID
columns* array - 프로젝트 컬럼 목록
Parameter Type Example Description
columnSrno* string 12 컬럼 일련번호
columnName* string 상태 컬럼 이름
columnLangCode* string dictionary:status 컬럼 다국어 코드
columnType* string STATUS 컬럼 타입
columnDescription* string 컬럼 설명
defaultColumnYn* string Y 기본 컬럼 여부
defaultColumnType* string STATUS 기본 컬럼 타입
projectId* string 317536 프로젝트 ID
multiOptionYn* string N 복수 옵션 허용 여부
viewYn* string Y 노출 여부
orderNum* string 1 정렬 순서
rgsrId* string system 등록자 ID
rgsnDateTime* string 20250501123045 등록 일시
edtrId* string system 수정자 ID
edtrDateTime* string 20250501123045 수정 일시
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "317536",
9 
 "columns": [
10 
 {
11 
 "columnSrno": "12",
12 
 "columnName": "상태",
13 
 "columnLangCode": "dictionary:status",
14 
 "columnType": "STATUS",
15 
 "columnDescription": "",
16 
 "defaultColumnYn": "Y",
17 
 "defaultColumnType": "STATUS",
18 
 "projectId": "317536",
19 
 "multiOptionYn": "N",
20 
 "viewYn": "Y",
21 
 "orderNum": "1",
22 
 "rgsrId": "system",
23 
 "rgsnDateTime": "20250

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/projects/{projectId}/columns/status 프로젝트 상태 컬럼 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 317536 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 317536 프로젝트 ID
columnSrno* string 12 상태 컬럼 일련번호
options* array - 상태 컬럼 옵션 목록
Parameter Type Example Description
optionSrno* string 18304 옵션 일련번호
projectId* string 317536 프로젝트 ID
columnSrno* string 12 컬럼 일련번호
optionName* string 대기 옵션 이름
optionLangCode* string system:code.S2791 옵션 다국어 코드
optionCategory* string 0 옵션 카테고리
optionOrder* string 1000.0000000000 옵션 정렬 순서
optionColor* string Multi06 옵션 색상 코드
rgsrId* string 등록자 ID
rgsnDateTime* string 20260220102206 등록 일시
edtrId* string 수정자 ID
edtrDateTime* string 20260220102206 수정 일시
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "317536",
9 
 "columnSrno": "12",
10 
 "options": [
11 
 {
12 
 "optionSrno": "18304",
13 
 "projectId": "317536",
14 
 "columnSrno": "12",
15 
 "optionName": "대기",
16 
 "optionLangCode": "system:code.S2791",
17 
 "optionCategory": "0",
18 
 "optionOrder": "1000.0000000000",
19 
 "optionColor": "Multi06",
20 
 "rgsrId": "",
21 
 "rgsnDateTime": "20260220102206",
22 
 "edtrId": "",
23 
 "edtrDateTime": "20260220102206"
24 
 },
25 
 {
26 
 "optionSrno": "1

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/projects 프로젝트 생성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Request Body
Parameter Type Example Description
title* string 테스트 프로젝트 프로젝트 제목
Constraints
min-length: 1
max-length: 50
description string 이 프로젝트는 OpenAPI로 생성되었습니다. 프로젝트 설명
Constraints
min-length: 1
max-length: 10000
defaultTab string feed 홈 탭 설정
Constraints
format: feed | task | gantt | calendar | file
postPermission object - 게시글 권한 정보
Parameter Type Example Description
view string all 게시글 조회권한
Constraints
default: all
format: all | registerAndAdmin
write string all 게시글 작성권한
Constraints
default: all
format: all | admin
edit string registerAndAdmin 게시글 수정권한
Constraints
default: registerAndAdmin
format: all | register | registerAndAdmin
commentPermission object - 댓글 권한 정보
Parameter Type Example Description
write string all 댓글 작성권한
Constraints
default: all
format: all | admin
Request Body Example
1 
// json
2 
{
3 
 "title": "테스트 프로젝트",
4 
 "description": "이 프로젝트는 OpenAPI로 생성되었습니다."
5 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 940907 프로젝트ID
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "230194"
9 
 }
10 
 }
11 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/projects/{projectId}/participants 프로젝트 참여자 생성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 230194 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
participants* array - 참여자 정보
Constraints
min-size: 1
Parameter Type Example Description
participantId* string user@company.name 참여자ID
Constraints
accept: 알파벳, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
Request Body Example
1 
// json
2 
{
3 
 "participants": [
4 
 {
5 
 "participantId": "user01@company.name"
6 
 },
7 
 {
8 
 "participantId": "user02@company.name"
9 
 }
10 
 ]
11 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 230194 프로젝트ID
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "230194"
9 
 }
10 
 }
11 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION


---

# User Divisions

## GET /user/divisions 부서 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
divisions* array - 부서 정보
Parameter Type Example Description
divisionCode* string 1 부서코드
upperDivisionCode* string 2 상위부서코드
divisionName* string 개발팀 부서명
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "divisions": [
9 
 {
10 
 "divisionCode": "1",
11 
 "upperDivisionCode": "",
12 
 "divisionName": "개발팀"
13 
 },
14 
 {
15 
 "divisionCode": "2",
16 
 "upperDivisionCode": "1",
17 
 "divisionName": "개발1팀"
18 
 },
19 
 {
20 
 "divisionCode": "3",
21 
 "upperDivisionCode": "1",
22 
 "divisionName": "개발2팀"
23 
 }
24 
 ]
25 
 }
26 
 }
27 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION


---

# User Employees

## GET /user/employees 구성원 목록 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
cursor string 0 페이징 커서 (page size: 100)
Constraints
accept: 숫자
default: 0

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean true 다음 정보 여부
lastCursor* number 100 마지막 커서 정보
employees* array - 사용자(구성원) 정보
Parameter Type Example Description
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자(구성원)ID
fullname* string 플로키 사용자(구성원) 이름
divisionId* string 1 부서코드 (삭제예정)
divisionCode* string 1 부서코드
divisionName* string 개발팀 부서명
responsibility* string 팀장 직책
cellPhoneNumber* string 01000000000 휴대폰 번호
companyPhoneNumber* string 01000000000 회사 전화번호
email* string company@company.com 이메일
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": true,
9 
 "lastCursor": 3,
10 
 "employees": [
11 
 {
12 
 "inttId": "BFLOW_000000001234",
13 
 "userId": "flow1@flow.team",
14 
 "fullname": "플로키1",
15 
 "divisionId": "1",
16 
 "divisionName": "개발팀",
17 
 "responsibility": "팀장",
18 
 "cellPhoneNumber": "01000000000",
19 
 "companyPhoneNumber": "01000000000",
20 
 "email": "company01@company.com"
21 
 },
22 
 {
23 
 "inttId": "BFLOW_000000001234",
24 
 "userId": "flow2@flow.team",
25 
 "fullname": "플로키2",
26 
 "divisionId": "1",
27 
 "divisionName": "개발팀",
28 

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/employees/me 내 구성원 정보 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자(구성원)ID
fullname* string 플로키 사용자(구성원) 이름
divisionId* string 1 부서코드 (삭제예정)
divisionCode* string 1 부서코드
divisionName* string 개발팀 부서명
responsibility* string 팀장 직책
cellPhoneNumber* string 01000000000 휴대폰 번호
companyPhoneNumber* string 01000000000 회사 전화번호
email* string company@company.com 이메일
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "inttId": "BFLOW_000000001234",
9 
 "userId": "flow@flow.team",
10 
 "fullname": "플로키",
11 
 "divisionId": "1",
12 
 "divisionName": "개발팀",
13 
 "responsibility": "팀장",
14 
 "cellPhoneNumber": "01000000000",
15 
 "companyPhoneNumber": "01000000000",
16 
 "email": "company01@company.com"
17 
 }
18 
 }
19 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/employees/{userId} 구성원 단건 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
userId* string flow@flow.team 사용자(구성원)ID
Constraints
accept: 알파벳, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
inttId* string BFLOW_000000001234 이용기관ID
userId* string flow@flow.team 사용자(구성원)ID
fullname* string 플로키 사용자(구성원) 이름
divisionId* string 1 부서코드 (삭제예정)
divisionCode* string 1 부서코드
divisionName* string 개발팀 부서명
responsibility* string 팀장 직책
cellPhoneNumber* string 01000000000 휴대폰 번호
companyPhoneNumber* string 01000000000 회사 전화번호
email* string company@company.com 이메일
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "inttId": "BFLOW_000000001234",
9 
 "userId": "flow@flow.team",
10 
 "fullname": "플로키",
11 
 "divisionId": "1",
12 
 "divisionName": "개발팀",
13 
 "responsibility": "팀장",
14 
 "cellPhoneNumber": "01000000000",
15 
 "companyPhoneNumber": "01000000000",
16 
 "email": "company01@company.com"
17 
 }
18 
 }
19 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION


---

# User Posts

## GET /user/posts/projects/{projectId} 프로젝트 내 게시글 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 23277 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Query Parameters
Parameter Type Example Description
cursor string 0 0-based 페이지 커서
Constraints
accept: 0 이상의 숫자
pageSize string 20 페이지 크기
Constraints
accept: 1 이상 100 이하의 숫자
default: 20
max: 100
postId string 40001 특정 게시글 기준 조회용 게시글 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
templateTypes string 1,2,4 템플릿 타입 콤마 구분 문자열
Constraints
accept: 숫자, 콤마
max-length: 1000

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 23277 프로젝트 ID
hasNext* boolean true 다음 페이지 존재 여부
lastCursor* number 1 다음 페이지 요청에 사용할 커서, 없으면 -1
posts* array - 조회된 게시글 목록
Parameter Type Example Description
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
remarkSrno* string -1 비고 일련번호
templateType* string 1 템플릿 타입
registerName* string 홍길동 작성자 이름
registeredDateTime* string 20260509093000 작성일시
projectTitle* string 고객 문의 프로젝트 프로젝트 제목
title* string 주간 진행 공유 게시글 제목
content* string 이번 주 주요 이슈를 공유합니다. 게시글 본문
htmlContent* string <p>이번 주 주요 이슈를 공유합니다.</p> HTML 본문
remarkCount* string 2 댓글 수
readYn* string Y 읽음 여부
sysCode* string FLOW 시스템 코드
rangeType* string ALL 공개 범위 타입
colaboGb* string 0 협업 구분값
checkedYn* string N 체크 여부
publicLinkPermission* string N 공개 링크 권한
subTaskCount* string 0 하위 업무 수
taskStatus* string REQUEST 업무 상태
scheduleStartDateTime* string 20260510100000 일정 시작일시
scheduleFinishDateTime* string 20260510110000 일정 종료일시
allDayYn* string N 종일 일정 여부
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "23277",
9 
 "hasNext": true,
10 
 "lastCursor": 1,
11 
 "posts": 

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/posts/{postId} 게시글 단건 상세 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 사용자 API Key
Path Parameters
Parameter Type Example Description
postId* string 40001 게시글 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - 게시글 상세 데이터
Parameter Type Example Description
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
remarkSrno* string -1 댓글 일련번호
templateType* string 1 게시글 템플릿 타입
title* string 주간 진행 공유 게시글 제목
content* string 이번 주 주요 이슈를 공유합니다. 게시글 본문
commentContent string 이번 주 주요 이슈를 공유합니다. 댓글형 본문
outContent string 외부 표시 본문
htmlContent* string <p>이번 주 주요 이슈를 공유합니다.</p> HTML 본문
contentJsonYn* string N 본문 JSON 여부
registerId* string flow@flow.team 작성자 ID
registerName* string 홍길동 작성자 이름
registeredDateTime* string 20260509093000 작성 일시
remarkCount* string 2 댓글 수
existYn* string Y 게시글 존재 여부
nextYn* string N 다음 데이터 존재 여부
totalCount* string 1 전체 건수
sectionCount* string 0 섹션 건수
remarks* array - 댓글 원본 목록
attachments* array - 첨부파일 원본 목록
imageAttachments* array - 이미지 첨부 원본 목록
todos* array - 할일 원본 목록
schedules* array - 일정 원본 목록
tasks* array - 업무 원본 목록
subTasks* array - 하위 업무 원본 목록
upLinkTasks* array - 상위 연결 업무 원본 목록
votes* array - 투표 원본 목록
projectColumns* array - 프로젝트 컬럼 원본 목록
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "23277",
9 
 "postId": "40001",
10 
 "remarkSrno": "-1",
11 
 "templateType": "1",


### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/posts/projects/{projectId}/tasks/filter 프로젝트 내 업무 필터 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 사용자 API Key
Path Parameters
Parameter Type Example Description
projectId* string 317938 프로젝트 ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Query Parameters
Parameter Type Example Description
cursor string 0 0-based 페이지 커서
Constraints
accept: 0 이상의 숫자
pageSize string 50 페이지 크기
Constraints
accept: 1 이상 100 이하의 숫자
default: 50
searchWord string 응대 업무 검색어
Constraints
max-length: 1000
upTaskId string 321292 상위 업무 ID
Constraints
accept: 숫자
mode string TREE 조회 모드
Constraints
max-length: 100
treeModeYn string Y 트리 모드 여부
Constraints
accept: Y, N
filterRecords string [
 {
 "COLUMN_SRNO": "12",
 "OPERATOR_TYPE": "IN",
 "FILTER_DATA": "19171,19172"
 }
] 업무 컬럼 필터 조건 JSON object array 문자열. 객체는 COLUMN_SRNO, OPERATOR_TYPE, FILTER_DATA로 구성합니다.
Constraints
accept: JSON object array string
item.COLUMN_SRNO: 필터링할 업무 컬럼 ID
item.OPERATOR_TYPE: 필터 연산자. 예: IN
item.FILTER_DATA: 필터 값. 여러 값은 콤마로 구분

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - 업무 필터 조회 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number -1 다음 페이지 요청에 사용할 커서, 없으면 -1
mode* string TREE 응답 모드
tasks* array - 업무 목록
Parameter Type Example Description
taskId* string 321292 업무 ID
orderNumber* string 1 정렬 번호
upTaskId* string -1 상위 업무 ID
subTaskCount* string 0 하위 업무 수
postId* string 40002 게시글 ID
projectId* string 317938 프로젝트 ID
projectTitle* string 고객 문의 프로젝트 프로젝트 제목
sectionId* string 100 섹션 ID
editAuthType* string ALL 수정 권한 타입
managerYn* string Y 관리자 여부
content* string 1차 응대 업무 업무 내용
upTaskName string 상위 업무명
directlyFilteredYn* string Y 직접 필터링 여부
hasFilteredSubtaskYn* string N 필터링된 하위 업무 존재 여부
backgroundColor string #FFFFFF 배경 색상
connectUrl string 연결 URL
postViewAuthYn* string Y 게시글 조회 권한 여부
columns* array - 업무 컬럼 목록
groupAggregates* array - 그룹 집계 원본 목록
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "lastCursor": -1,
10 
 "mode": "TREE",
11 
 "tasks": [
12 
 {
13 
 "taskId": "321292",
14 
 "orderNumber": "1",
15 
 "upTaskId": "-1",
16 
 "subTaskCount": "0",
17 
 "postId": "40002",
18 
 "projectId": "317938",
19 
 "

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/posts/projects/{projectId} 게시글 작성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
title* string 모니터링 알림 게시글 제목
Constraints
min-length: 1
max-length: 200
contents* string 모니터링 알림이 도착했습니다. 확인해주세요. 게시글 본문
Constraints
min-length: 1
max-length: 10000
files array - 첨부파일 정보
Parameter Type Example Description
fileName* string file.txt 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 첨부 파일
Constraints
format: base64
min-length: 1
imageFiles array - 이미지 정보
Parameter Type Example Description
fileName* string file.txt 이미지 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 이미지 파일
Constraints
format: base64
min-length: 1
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
Request Body Example
1 
// json
2 
{
3 
 "title": "모니터링 알림",
4 
 "contents": "모니터링 알림이 도착했습니다. 확인해주세요."
5 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "940907",
9 
 "postId": "960702",
10 
 "tinyUrl": "https://flow.team/l/a12412asd"
11 
 }
12 
 }
13 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/posts/projects/{projectId}/tasks 업무 작성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
title* string 구매 요청서 게시글 제목
Constraints
min-length: 1
max-length: 200
contents* string 구매 요청서가 도착했습니다. 게시글 본문
Constraints
min-length: 1
max-length: 10000
status* string request 업무 상태
Constraints
format: request | progress | feedback | complete | hold
priority string nomal 우선순위
Constraints
format: low | normal | high | urgent
startDate string 20230808 시작일
Constraints
format: YYYYMMDD
length: 8
endDate string 20230815 종료일
Constraints
format: YYYYMMDD
length: 8
workers array - 담당자 정보
Parameter Type Example Description
workerId* string tyler@company.name 담당자
Constraints
accept: 소문자, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
files array - 첨부파일 정보
Parameter Type Example Description
fileName* string file.txt 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 첨부 파일
Constraints
format: base64
min-length: 1
imageFiles array - 이미지 정보
Parameter Type Example Description
fileName* string file.txt 이미지 파일명
Constraints
refuse: 특수문자(\, /, :, *, ?, ", <, >, |)
min-length: 1
max-length: 100
fileContents* string iVBOAA ... YAAAKka 이미지 파일
Constraints
format: base64
min-length: 1
viewPermission string all 조회권한
Co

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
taskId* string 981029 업무ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "940907",
9 
 "postId": "960702",
10 
 "taskId": "981029",
11 
 "tinyUrl": "https://flow.team/l/a12412asd"
12 
 }
13 
 }
14 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/posts/projects/{projectId}/tasks/{taskId}/status 업무 상태 수정

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 317536 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 318014 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
status string progress legacy 업무 상태
Constraints
format: request | progress | feedback | complete | hold
rule: optionSrno 와 동시에 보낼 수 없음
optionSrno string 18307 업무 2.0 상태 옵션 일련번호
Constraints
accept: 숫자
min-length: 1
max-length: 15
rule: status 와 동시에 보낼 수 없고 같은 프로젝트 상태 컬럼 옵션값이어야 함
Request Body Example
1 
// json
2 
{
3 
 "optionSrno": "18307"
4 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success"
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 400,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "VALIDATION_ERROR",
9 
 "message": "동일한 업무 상태로 변경할 수 없습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/posts/projects/{projectId}/tasks/{taskId}/start-date 업무 시작일 수정

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
startDate string 20250101 시작일
Constraints
format: YYYYMMDD
length: 8
Request Body Example
1 
// json
2 
{
3 
 "startDate": "20250101"
4 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success"
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/posts/projects/{projectId}/tasks/{taskId}/end-date 업무 마감일 수정

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
endDate string 20250101 마감일
Constraints
format: YYYYMMDD
length: 8
Request Body Example
1 
// json
2 
{
3 
 "endDate": "20250101"
4 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success"
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/posts/projects/{projectId}/tasks/{taskId}/priority 업무 우선순위 수정

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
priority string nomal 우선순위
Constraints
format: low | normal | high | urgent
Request Body Example
1 
// json
2 
{
3 
 "priority": "normal"
4 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success"
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/posts/projects/{projectId}/tasks/{taskId}/worker 업무 담당자 수정

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
taskId* string 10923 업무ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
workers array - 담당자 정보
Parameter Type Example Description
workerId* string tyler@company.name 담당자
Constraints
accept: 소문자, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
Request Body Example
1 
// json
2 
{
3 
 "workers": [
4 
 {
5 
 "workerId": "tyler@company.name"
6 
 }
7 
 ]
8 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success"
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/posts/projects/{projectId}/schedules 일정 작성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
title* string 일정 제목 예시 일정 제목
Constraints
min-length: 1
max-length: 200
memo string 메모 예시 메모
Constraints
min-length: 1
max-length: 4000
isAllDay* boolean true 종일일정 여부
Constraints
format: true | false
startDateTime* string 20230808160000 시작일시
Constraints
format: YYYYMMDDHHmmss
length: 14
endDateTime* string 20230815093000 종료일시
Constraints
format: YYYYMMDDHHmmss
length: 14
attendance array - 참석자 정보
Parameter Type Example Description
attendanceId* string tyler@company.name 참석자
Constraints
accept: 소문자, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
Request Body Example
1 
// json
2 
{
3 
 "title": "일정 제목 예시",
4 
 "isAllDay": true,
5 
 "startDateTime": "20230808160000",
6 
 "endDateTime": "20230815093000",
7 
 "attendance": [
8 
 {
9 
 "attendanceId": "tyler@company.name"
10 
 }
11 
 ]
12 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "940907",
9 
 "postId": "960702",
10 
 "tinyUrl": "https://flow.team/l/a12412asd"
11 
 }
12 
 }
13 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/posts/projects/{projectId}/todos 할일 작성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
projectId* string 940907 프로젝트ID
Constraints
accept: 숫자
min-length: 1
max-length: 15
Request Body
Parameter Type Example Description
title* string 할일 제목 예시 할일 제목
Constraints
min-length: 1
max-length: 200
todoList* array - 할일 목록
Constraints
min-size: 1
max-size: 50
Parameter Type Example Description
contents* string 주간 회의록 작성하기 내용
Constraints
min-length: 1
max-length: 60
endDate string 20240617 종료일
Constraints
format: YYYYMMDD
length: 8
viewPermission string all 조회권한
Constraints
default: all
format: all | admin
Request Body Example
1 
// json
2 
{
3 
 "title": "일정 제목 예시",
4 
 "todoList": [
5 
 {
6 
 "contents": "주간 보고서 작성하기",
7 
 "endDate": "20240620"
8 
 },
9 
 {
10 
 "contents": "월간 보고서 작성하기"
11 
 }
12 
 ]
13 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
projectId* string 940907 프로젝트ID
postId* string 960702 게시글ID
tinyUrl* string https://flow.team/l/a12412asd 링크주소
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "projectId": "940907",
9 
 "postId": "960702",
10 
 "tinyUrl": "https://flow.team/l/a12412asd"
11 
 }
12 
 }
13 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION


---

# User Calendars

## GET /user/calendars 사용자 캘린더 목록 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
editableCalendars* array - 사용자가 수정 가능한 캘린더 목록
Parameter Type Example Description
calendarSrno* string 10001 캘린더 일련번호
calendarName* string 홍길동 캘린더 이름
calendarType* string PERSONAL 캘린더 유형
customCalendarName* string 홍길동 사용자 지정 캘린더 이름
userPermission* string ADMIN 사용자 권한
calendarVisibilityYn* string Y 캘린더 공개 여부
calendarColor* string 4F8EF7 캘린더 색상
calendarRole* string OWNER 사용자의 캘린더 역할
colaboSrno* string 연결된 프로젝트/협업 일련번호
rgsrId* string flow@flow.team 등록자 ID
viewOnlyCalendars* array - 읽기 전용 캘린더 목록
Parameter Type Example Description
calendarSrno* string 20001 캘린더 일련번호
projectCalendars* array - 프로젝트 캘린더 목록
Parameter Type Example Description
calendarSrno* string 30001 캘린더 일련번호
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "editableCalendars": [
9 
 {
10 
 "calendarSrno": "10001",
11 
 "calendarName": "홍길동",
12 
 "calendarType": "PERSONAL",
13 
 "customCalendarName": "홍길동",
14 
 "userPermission": "ADMIN",
15 
 "calendarVisibilityYn": "Y",
16 
 "calendarColor": "4F8EF7",
17 
 "calendarRole": "OWNER",
18 
 "colaboSrno": "",
19 
 "rgsrId": "flow@flow.team"
20 
 }

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/calendars/default 기본 캘린더 ID 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
calendarId* string flow-calendar-user01 기본 캘린더 식별자
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "calendarId": "flow-calendar-user01"
9 
 }
10 
 }
11 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/calendars/subscribables 구독 가능 캘린더 검색

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
searchWord* string 홍길동 캘린더 검색어
Constraints
min-length: 1
max-length: 100
cursor string 0 페이징 커서
Constraints
accept: 0 이상의 숫자
default: 0
pageSize string 50 페이지 크기
Constraints
accept: 1 이상의 숫자
default: 50

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number -1 다음 페이지 요청에 사용할 커서
calendars* array - 검색된 캘린더 목록
Parameter Type Example Description
calendarName* string 홍길동 캘린더 이름
calendarSrno* string 10001 캘린더 일련번호
calendarType* string PERSONAL 캘린더 유형
calendarPermission* string DETAIL_VIEWER 구독 시 권한
userId* string user01 사용자 ID
fullname* string 홍길동 사용자 이름
responsibility* string 매니저 직책
profileImagePath* string /profile/user01.png 프로필 이미지 경로
email* string user01@example.com 이메일
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "lastCursor": -1,
10 
 "calendars": [
11 
 {
12 
 "calendarName": "홍길동",
13 
 "calendarSrno": "10001",
14 
 "calendarType": "PERSONAL",
15 
 "calendarPermission": "DETAIL_VIEWER",
16 
 "userId": "user01",
17 
 "fullname": "홍길동",
18 
 "responsibility": "매니저",
19 
 "profileImagePath": "/profile/user01.png",
20 
 "email": "user01@example.com"
21 
 }
22 
 ]
23 
 }
24 
 }
25 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_E

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/calendars/events 일정 범위 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
userId string flow@flow.team 일정을 조회할 사용자 ID. 입력하지 않으면 인증된 사용자 ID를 사용합니다.
Constraints
accept: 알파벳, 숫자, 특수문자(-, _, @, .)
min-length: 1
max-length: 100
startDateTime* string 20260501000000 조회 시작일시
Constraints
format: YYYYMMDDHHmmss
length: 14
endDateTime* string 20260531235959 조회 종료일시
Constraints
format: YYYYMMDDHHmmss
length: 14
cursor string 0 페이징 커서
Constraints
accept: 0 이상의 숫자
pageSize string 100 페이지 크기
Constraints
accept: 1 이상의 숫자
default: 100

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number -1 다음 페이지 요청에 사용할 커서
events* array - 조회된 일정 목록
Parameter Type Example Description
eventSrno* string 123456789 일정 일련번호
calendarSrno* string 12345 캘린더 일련번호
eventName* string 주간 회의 일정 제목
eventBody* string 안건 공유 및 진행상황 점검 일정 본문
eventStartDateTime* string 20260510100000 시작일시
eventFinishDateTime* string 20260510110000 종료일시
allDayYn* string N 종일 일정 여부
privateYn* string N 비공개 여부
publicYn* string Y 공개 여부
publicNameYn* string Y 이름 공개 여부
gmtTime* string GMT+09:00 GMT 오프셋
timezone* string Asia/Seoul 타임존
repeatSrno* string 반복 일정 일련번호
repeatInstanceId* string 반복 인스턴스 ID
attendanceStatus* string 참석 상태
attendanceInfo* string 참석자 정보
calendarName* string 홍길동 캘린더 이름
customCalendarName* string 홍길동 사용자 지정 캘린더 이름
calendarRole* string OWNER 캘린더 역할
calendarColor* string 4F8EF7 캘린더 색상
eventColor* string FF5733 일정 색상
colaboSrno* string 협업 일련번호
colaboCommtSrno* string 협업 댓글 일련번호
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "lastCursor": -1,
10 
 "events": [
11 
 {
12 
 "eventSrno": "123456789",
13 


### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/calendars/events/{eventSrno} 일정 상세 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
eventSrno* string 123456789 일정 일련번호
Constraints
accept: 숫자
Query Parameters
Parameter Type Example Description
eventStartDateTime string 20260510100000 반복 인스턴스 시작일시
Constraints
format: YYYYMMDDHHmmss
length: 14
eventFinishDateTime string 20260510110000 반복 인스턴스 종료일시
Constraints
format: YYYYMMDDHHmmss
length: 14

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
event* object - 일정 상세 정보
Parameter Type Example Description
eventSrno* string 123456789 일정 일련번호
calendarSrno* string 12345 캘린더 일련번호
eventName* string 주간 회의 일정 제목
eventBody* string 안건 공유 및 진행상황 점검 일정 본문
eventStartDateTime* string 20260510100000 시작일시
eventFinishDateTime* string 20260510110000 종료일시
allDayYn* string N 종일 일정 여부
privateYn* string N 비공개 여부
publicYn* string Y 공개 여부
publicNameYn* string Y 이름 공개 여부
gmtTime* string GMT+09:00 GMT 오프셋
timezone* string Asia/Seoul 타임존
location* string 회의실 A 장소
locationCoordinates* string 37.5665,126.9780 좌표 정보
locationUrl* string https://map.example.com 장소 URL
eventColor* string FF5733 일정 색상
repeatSrno* string 반복 일정 일련번호
repeatInstanceId* string 반복 인스턴스 ID
attendanceStatus* string 내 참석 상태
calendarName* string 홍길동 캘린더 이름
customCalendarName* string 홍길동 사용자 지정 캘린더 이름
calendarColor* string 4F8EF7 캘린더 색상
calendarOwner* string flow@flow.team 캘린더 소유자
calendarType* string PERSONAL 캘린더 유형
calendarRole* string OWNER 캘린더 역할
userPermission* string ADMIN 사용자 권한
vcSrno* string 화상회의 일련번호
contentModifiability* string Y 내용 수정 가능 여부
colaboSrno* string 협업 일련번호
colaboCommtSrno* string 협업 댓글 일련번호
rgsrId* string flow@flow.team 등록자 ID
rgsrNm* string 홍길동 등록자명
rgsnDateTime* string 20260501103000 등록일시
prflPhtg* string /profile/user01.png 등록자 프로필 이미지
originSrno* string 원본 일정 일련

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## POST /user/calendars/events 일정 생성

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Request Body
Parameter Type Example Description
calendarSrno* string 12345 캘린더 일련번호
Constraints
accept: 숫자
eventName* string 전체 필드 테스트 일정 일정 제목
Constraints
min-length: 1
max-length: 200
eventBody string 본문 내용 테스트 일정 본문
Constraints
max-length: 10000
allDayYn* string N 종일 일정 여부
Constraints
format: Y | N
gmtTime* string GMT+09:00 GMT 오프셋
Constraints
min-length: 1
max-length: 20
publicYn* string Y 공개 여부
Constraints
format: Y | N
publicNameYn* string Y 이름 공개 여부
Constraints
format: Y | N
eventStartTimestamp* string 20260515100000 시작일시
Constraints
format: YYYYMMDDHHmmss
length: 14
eventFinishTimestamp* string 20260515110000 종료일시
Constraints
format: YYYYMMDDHHmmss
length: 14
location string 회의실 A 장소
Constraints
max-length: 500
locationCoordinates string 37.5665,126.9780 좌표 정보
Constraints
max-length: 200
locationUrl string https://map.example.com 장소 URL
Constraints
max-length: 500
eventColor string FF5733 일정 색상
Constraints
max-length: 20
sendAttendanceAlarmYn string Y 참석자 알림 전송 여부
Constraints
format: Y | N
attendances array - 참석자 목록
Parameter Type Example Description
attendanceType* string ID 참석자 식별 유형
Constraints
format: ID | EMAIL
attendanceInfo* string flow@flow.team 참석자 식별 정보
Constraints
min-length: 1
max-length: 200
attendanceName string 홍길동 참석자 이름
Constraints
min-length: 1
max-length: 100
notifications array - 알림 설정 목록
Parameter Type Example Description
n

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
eventSrno* string 987654321 생성된 일정 일련번호
repeatSrno* string 생성된 반복 일정 일련번호
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "eventSrno": "987654321",
9 
 "repeatSrno": ""
10 
 }
11 
 }
12 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 400,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "VALIDATION_ERROR",
9 
 "message": "캘린더 일련번호 은(는) 필수 값입니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/calendars/events/{eventSrno} 일정 수정

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
eventSrno* string 987654321 수정할 일정 일련번호
Constraints
accept: 숫자
Request Body
Parameter Type Example Description
eventStartTimestamp* string 20260515103000 시작일시
Constraints
format: YYYYMMDDHHmmss
length: 14
eventFinishTimestamp* string 20260515113000 종료일시
Constraints
format: YYYYMMDDHHmmss
length: 14
allDayYn* string N 종일 일정 여부
Constraints
format: Y | N
gmtTime* string GMT+09:00 GMT 오프셋
Constraints
min-length: 1
max-length: 20
publicYn* string Y 공개 여부
Constraints
format: Y | N
publicNameYn* string Y 이름 공개 여부
Constraints
format: Y | N
eventName string 수정된 일정명 일정 제목
Constraints
min-length: 1
max-length: 200
eventBody string 수정된 본문 일정 본문
Constraints
max-length: 10000
calendarSrno string 12345 이동할 캘린더 일련번호
Constraints
accept: 숫자
location string 회의실 B 장소
Constraints
max-length: 500
locationCoordinates string 37.5665,126.9780 좌표 정보
Constraints
max-length: 200
locationUrl string https://map.example.com 장소 URL
Constraints
max-length: 500
eventColor string FF5733 일정 색상
Constraints
max-length: 20
sendAttendanceAlarmYn string Y 참석자 알림 전송 여부
Constraints
format: Y | N
repeatEditOption string THIS 반복 일정 수정 범위
Constraints
format: THIS | AFTER | ALL
repeatInstanceId string 20260515100000 반복 인스턴스 ID
addAttendances array - 추가할 참석자 목록
Parameter Type Example Description
attendanceType* string ID 참석자 식별 유형
attendanceInfo* st

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
eventStartDateTime* string 20260515103000 수정된 시작일시
eventFinishDateTime* string 20260515113000 수정된 종료일시
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "eventStartDateTime": "20260515103000",
9 
 "eventFinishDateTime": "20260515113000"
10 
 }
11 
 }
12 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 400,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "VALIDATION_ERROR",
9 
 "message": "시작일시 은(는) 필수 값입니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## DELETE /user/calendars/events/{eventSrno} 일정 삭제

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Path Parameters
Parameter Type Example Description
eventSrno* string 987654321 삭제할 일정 일련번호
Constraints
accept: 숫자
Request Body
Parameter Type Example Description
repeatEditOption string THIS 반복 일정 삭제 범위
Constraints
format: THIS | AFTER | ALL
repeatInstanceId string 20260515100000 반복 인스턴스 ID
Request Body Example
1 
// json
2 
{}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {}
8 
 }
9 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 400,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "VALIDATION_ERROR",
9 
 "message": "사용자ID 은(는) 필수 값입니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION


---

# User Search

## GET /user/search/posts 글 검색

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
searchWord* string 회의 검색어
Constraints
min-length: 1
max-length: 100
startDateTime string 20251107000000 검색 시작일시
Constraints
format: YYYYMMDDHHmmss
default: 최근 6개월 시작일 00:00:00
endDateTime string 20260507235959 검색 종료일시
Constraints
format: YYYYMMDDHHmmss
default: 오늘 종료일 23:59:59
orderType string SCORE 정렬 기준
Constraints
enum: SCORE, LATEST, OLDEST
default: SCORE
size string 20 조회 건수
Constraints
accept: 1 이상의 숫자
default: 20
score string 0.782194 다음 페이지 조회용 score
Constraints
dependency: pageTargetId와 함께 사용
pageTargetId string 40001 다음 페이지 기준 게시글 ID
Constraints
dependency: score와 함께 사용
projectIds string 23277,23278 프로젝트 ID 콤마 구분 문자열
Constraints
accept: 숫자, 콤마
templateTypes string 1,2 템플릿 타입 콤마 구분 문자열
Constraints
accept: 0 이상의 숫자, 콤마
disallow: -1

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
score* string 0.782194 다음 페이지 요청에 재사용할 score
pageTargetId* string 40001 다음 페이지 요청에 재사용할 기준 ID
posts* array - 검색된 게시글 목록
Parameter Type Example Description
ttl* string 고객 문의 프로젝트 프로젝트 제목
commtTtl* string 주간 회의 일정 공유 게시글 제목
content* string 회의 안건을 공유합니다. 게시글 본문
templateType* string 1 템플릿 타입
projectId* string 23277 프로젝트 ID
postId* string 40001 게시글 ID
remarkSrno* string -1 비고 일련번호
replySrno* string -1 답글 일련번호
registerId* string flow@flow.team 작성자 ID
registerName* string 홍길동 작성자 이름
registeredDateTime* string 20260507123000 작성일시
taskState* string REQUEST 업무 상태 문자열
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "score": "",
10 
 "pageTargetId": "",
11 
 "posts": [
12 
 {
13 
 "ttl": "고객 문의 프로젝트",
14 
 "commtTtl": "주간 회의 일정 공유",
15 
 "content": "회의 안건을 공유합니다.",
16 
 "templateType": "1",
17 
 "projectId": "23277",
18 
 "postId": "40001",
19 
 "remarkSrno": "-1",
20 
 "replySrno": "-1",
21 
 "registerId": "flow@flow.team",
22 
 "registerName": "홍길동",
23 
 "registeredDateTime": "20260507123000",
24 
 "tas

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/search/projects 프로젝트 검색

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
searchWord* string 회의 검색어
Constraints
min-length: 1
max-length: 100
startDateTime string 20251107000000 검색 시작일시
Constraints
format: YYYYMMDDHHmmss
default: 최근 6개월 시작일 00:00:00
endDateTime string 20260507235959 검색 종료일시
Constraints
format: YYYYMMDDHHmmss
default: 오늘 종료일 23:59:59
orderType string SCORE 정렬 기준
Constraints
enum: SCORE, LATEST, OLDEST
default: SCORE
size string 20 조회 건수
Constraints
accept: 1 이상의 숫자
default: 20
score string 0.910023 다음 페이지 조회용 score
Constraints
dependency: pageTargetId와 함께 사용
pageTargetId string 23277 다음 페이지 기준 프로젝트 ID
Constraints
dependency: score와 함께 사용

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
score* string 0.910023 다음 페이지 요청에 재사용할 score
pageTargetId* string 23277 다음 페이지 요청에 재사용할 기준 ID
projects* array - 검색된 프로젝트 목록
Parameter Type Example Description
projectId* string 23277 프로젝트 ID
ttl* string 고객 문의 프로젝트 프로젝트 제목
homeTabCode* string HOME 홈 탭 코드
backgroundColorCode* string 4F8EF7 배경 색상 코드
importantYn* string N 중요 프로젝트 여부
participantCount* string 3 참여자 수
editedDateTime* string 20260507121000 수정일시
participants* array - 프로젝트 참여자 목록
Parameter Type Example Description
userId* string flow@flow.team 참여자 ID
userName* string 홍길동 참여자 이름
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "score": "",
10 
 "pageTargetId": "",
11 
 "projects": [
12 
 {
13 
 "projectId": "23277",
14 
 "ttl": "고객 문의 프로젝트",
15 
 "homeTabCode": "HOME",
16 
 "backgroundColorCode": "4F8EF7",
17 
 "importantYn": "N",
18 
 "participantCount": "3",
19 
 "editedDateTime": "20260507121000",
20 
 "participants": [
21 
 {
22 
 "userId": "flow@flow.team",
23 
 "userName": "홍길동"
24 
 },
25 
 {
26 
 "userId": "test@flow.team",
27 
 "u

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/search/employees 구성원 검색

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
searchWord string 홍 직원 검색어
Constraints
max-length: 100
divisionCode string D001 부서 코드
Constraints
max-length: 100
cursor string 0 페이징 커서
Constraints
accept: 0 이상의 숫자
pageSize string 50 조회 개수
Constraints
accept: 1 이상 100 이하의 숫자
roomId string 10001 채팅방 번호
Constraints
accept: 숫자
keyword string user_nm:홍길동 dvsn_nm:개발 타입별 키워드 검색 조건
Constraints
format: type:value 공백 구분
groupCode string G001 그룹 코드
employeeType string EMP 직원 유형
projectId string 23277 프로젝트 ID
Constraints
accept: 숫자

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number -1 다음 조회에 사용할 커서
employees* array - 검색된 구성원 목록
Parameter Type Example Description
flowUserYn* string Y Flow 사용자 여부
portalId* string PTL_51 포탈 ID
channelId* string CHNL_1 채널 ID
institutionId* string BFLOW_1000 이용기관 ID
userId* string flow@flow.team 사용자 ID
profileImagePath* string 프로필 이미지 경로
fullname* string 홍길동 사용자 이름
responsibility* string 팀장 직급/직책명
responsibilityName* string 팀장 직책명
companyName* string 플로우 회사명
divisionName* string 개발팀 부서명
phoneNumber* string 01012345678 휴대폰 번호
phoneCountryCode* string 82 휴대폰 국가번호
companyPhoneNumber* string 0212345678 회사 전화번호
email* string flow@flow.team 이메일
status* string 1 사용자 상태
bookmarkYn* string N 즐겨찾기 여부
loginYn* string Y 로그인 이력 여부
dayoffName* string 휴가/근태 상태명
chargeJobName* string API 개발 담당 업무
employeeNumber* string E001 사원번호
divisionCode* string D001 부서 코드
groupCode* string 그룹 코드
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "lastCursor": -1,
10 
 "employees": [
11 
 {
12 
 "flowUserYn": "Y",
13 
 "portalId": "PTL_51",
14 
 "channelId

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## GET /user/search/events 일정 검색

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 API Key
Query Parameters
Parameter Type Example Description
searchWord* string 회의 일정명 검색어
Constraints
min-length: 2
max-length: 100
startDateTime* string 20260601000000 검색 시작일시
Constraints
format: YYYYMMDDHHmmss
endDateTime* string 20260630235959 검색 종료일시
Constraints
format: YYYYMMDDHHmmss
cursor string 0 페이징 시작 위치
Constraints
accept: 0 이상의 숫자
pageSize string 50 조회 개수
Constraints
accept: 1 이상 200 이하의 숫자
pagingReverse string N 정렬 방향
Constraints
enum: Y, N
default: N

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number -1 다음 조회에 사용할 커서
events* array - 검색된 일정 목록
Parameter Type Example Description
calendarName* string 내 캘린더 캘린더명
customCalendarName* string 사용자별 커스텀 캘린더명
calendarRole* string OWNER 캘린더 역할
eventSrno* string 1000001 일정 ID
calendarSrno* string 200001 캘린더 ID
eventName* string 주간 회의 일정명
eventStartDateTime* string 20260610100000 일정 시작일시
eventFinishDateTime* string 20260610110000 일정 종료일시
allDayYn* string N 종일 여부
timezone* string Asia/Seoul 일정 타임존
gmtTime* string +09:00 GMT 시간대
calendarColor* string 4A90E2 캘린더 색상
eventColor* string 4A90E2 일정 색상
publicYn* string Y 공개 여부
publicNameYn* string Y 이름 공개 여부
privateYn* string N 비공개 처리 여부
attendanceSrno* string 300001 참여자 정보 번호
attendanceInfo* string flow@flow.team 참여자 정보
attendanceStatus* string ACCEPT 일정 참여 상태
originSrno* string 원본 일정 번호
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "code": 200,
6 
 "message": "success",
7 
 "data": {
8 
 "hasNext": false,
9 
 "lastCursor": -1,
10 
 "events": [
11 
 {
12 
 "calendarName": "내 캘린더",
13 
 "customCalendarName": "",
14 
 "calendarRole": "OWNER",
15 
 "eventSrno": "1000001",

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION


---

# User Alarms

## GET /user/alarms 내 알림 조회

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 사용자 API Key
Query Parameters
Parameter Type Example Description
filters string MENTION,WORKER 알림 필터 목록
Constraints
accept: MENTION, REGISTRANT, WORKER
cursor string 0 페이징 커서
Constraints
accept: 0 이상의 숫자
size string 20 조회 개수
Constraints
min: 1
max: 100

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
Parameter Type Example Description
alarms* object - 알림 목록 응답
Parameter Type Example Description
hasNext* boolean false 다음 페이지 존재 여부
lastCursor* number 2 다음 조회에 사용할 마지막 커서
alarms* array - 알림 목록
Parameter Type Example Description
alarmId* string 900001 알림 고유 번호
projectId* string 317536 프로젝트 ID
postId* string 1046747 게시글 ID
remarkId* string -1 댓글 ID
replyId* string -1 답글 ID
receiverId* string flow@flow.team 알림 수신자 ID
registerId* string manager@flow.team 알림 등록자 ID
registerName* string 김플로 알림 등록자 이름
registeredDateTime* string 20260610103000 알림 등록 일시
message string 김플로님이 회원님을 언급했습니다. 알림 메시지
content string 업무 진행 상황을 확인해 주세요. 알림 본문
readYn* string N 읽음 여부
alarmType string MENTION 알림 유형
mentionYn* string Y 멘션 알림 여부
registrantYn* string N 내가 등록한 글 알림 여부
workerYn* string N 내 담당 업무 알림 여부
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "message": "success",
6 
 "data": {
7 
 "alarms": {
8 
 "hasNext": false,
9 
 "lastCursor": 1,
10 
 "alarms": [
11 
 {
12 
 "alarmId": "900001",
13 
 "projectId": "317536",
14 
 "postId": "1046747",
15 
 "remarkId": "-1",
16 
 "replyId": "-1",
17 
 "receiverId": "flow@flow.team",
18 
 "registerId": "manager@flow.team",
19 


### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/alarms/read 단일 알림 읽음 처리

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 사용자 API Key
Request Body
Parameter Type Example Description
alarmId* string 900001 읽음 처리할 알림 ID
Constraints
accept: 숫자
Request Body Example
1 
// json
2 
{
3 
 "alarmId": "900001"
4 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "message": "success",
6 
 "data": {}
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION

## PATCH /user/alarms/read/all 전체 알림 읽음 처리

### Request
Request API 요청 데이터 정보
* 표시된 항목은 필수 항목입니다.
Header Parameters
Parameter Type Example Description
Content-Type* string application/json 요청 데이터 형식
x-flow-api-key* string <API_KEY> 키관리 페이지에서 발급받은 사용자 API Key
Request Body
Parameter Type Example Description
projectId string 317536 특정 프로젝트 알림만 전체 읽음 처리할 때 사용하는 프로젝트 ID
Constraints
accept: 숫자
Request Body Example
1 
// json
2 
{
3 
 "projectId": "317536"
4 
}

### Response
Response API 응답 데이터 정보
* 표시된 항목은 반드시 존재하는 항목입니다. 오류 코드, 메시지 정보는 Error 를 참고해주세요.
Response Body
Parameter Type Example Description
success* boolean true API 요청 성공 여부
code* number 200 HTTP Status Code
message* string success API 응답 메시지
data object - API 응답 데이터
error object - API 응답 오류
Parameter Type Example Description
code* string UNAUTHORIZED_ERROR 오류코드
message* string API Key 정보가 올바르지 않습니다. 오류 메시지
Response Body Example
1 
// json (요청성공)
2 
{
3 
 "response": {
4 
 "success": true,
5 
 "message": "success",
6 
 "data": {}
7 
 }
8 
}
1 
// json (요청실패)
2 
{
3 
 "response": {
4 
 "success": false,
5 
 "code": 401,
6 
 "message": "error",
7 
 "error": {
8 
 "code": "UNAUTHORIZED_ERROR",
9 
 "message": "API Key 정보가 올바르지 않습니다."
10 
 }
11 
 }
12 
}

### Error
Error API 요청 오류 정보
오류 데이터 형식은 Response 를 참고해주세요.
Error Codes
HTTP Status Code Code Description
400 VALIDATION_ERROR 클라이언트에서 보낸 요청의 잘못된 형식 오류
401 UNAUTHORIZED_ERROR 필요한 인증 정보가 누락된 경우
403 FORBIDDEN_ERROR 해당 리소스에 접근 권한이 없는 경우
404 NOT_FOUND_ERROR 요청하는 리소스를 찾을 수 없는 경우
409 ALREADY_EXIST_ERROR 클라이언트가 요청하는 리소스가 이미 존재하는 경우
412 PRECONDITION_FAILED_ERROR 선행조건을 만족하지 않아 요청을 처리할 수 없는 경우
412 NOT_EXIST_ERROR 요청하는 리소스를 찾을 수 없어 수정, 삭제가 불가능한 경우
412 REACHED_MAX_ERROR 생성 가능한 리소스의 한계에 도달하여 더이상 생성이 불가능한 경우
429 RATE_LIMIT_EXCEEDED_ERROR 요청 횟수가 사용량을 초과한 경우
500 INTERNAL_SERVER_ERROR 특정할 수 없는 서버의 내부 오류
500 SQL_EXECUTION
