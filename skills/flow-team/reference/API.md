# Flow Open API — Complete Reference

Base URL: `https://api.flow.team`
Portal: Developer Portal 2.0.11

All requests require these headers:

```
Content-Type: application/json
x-flow-api-key: <YOUR_API_KEY>
```

## Response envelope

Success:
```json
{ "response": { "success": true, "code": 200, "message": "success", "data": { ... } } }
```
Failure:
```json
{ "response": { "success": false, "code": 401, "message": "error",
  "error": { "code": "UNAUTHORIZED_ERROR", "message": "API Key 정보가 올바르지 않습니다." } } }
```

Status legend below: ✅ = verified live · 📄 = from portal docs (request shape known) · ⚪ = path known, body unverified.

---

## User Projects

### `GET /user/projects` ✅
List projects. → `data.projects[]`: `{ projectId, title, projectUrl }`

### `GET /user/projects/participants` ✅
Projects I participate in. Same shape as above.

### `GET /user/projects/{projectId}` ✅
Single project detail. → `data.project`

### `GET /user/projects/{projectId}/participants` ✅
→ `data.participants[]`: `{ inttId, userId, name }`

### `GET /user/projects/{projectId}/columns` ✅
Board columns. → `data.columns[]`: `{ columnSrno, columnName, columnType, defaultColumnType, viewYn, orderNum, ... }`
`columnType` ∈ `TEXT | STATUS | …`. `defaultColumnType` e.g. `TASK_NM`, `STATUS`.

### `GET /user/projects/{projectId}/columns/status` ✅
Status-column options. → `data.options[]`: `{ optionSrno, optionName, optionColor, optionCategory, optionOrder }`
(e.g. 대기 / 진행 / …; `optionCategory` 0=todo, 1=in-progress, …)

### `POST /user/projects` ⚪
Create a project. Body unverified — see portal Request tab before use.

### `POST /user/projects/{projectId}/participants` ⚪
Add participants. Body unverified.

---

## User Employees

### `GET /user/employees` ✅
Org member list. Query: `cursor` (page size fixed 100).
→ `data`: `{ hasNext, lastCursor, employees[] }`
`employees[]`: `{ inttId, userId, fullname, divisionId, divisionCode, divisionName, responsibility, cellPhoneNumber, companyPhoneNumber, email }`
Note: `userId` is the login id (e.g. `qortkdgus95`), not always an email.

### `GET /user/employees/me` ✅
My member info — same fields, flat under `data`.

### `GET /user/employees/{userId}` ✅
Single member — same fields.

---

## User Posts (게시글 · 업무 · 일정 · 할일)

### `GET /user/posts/projects/{projectId}` ✅
Posts in a project. Query: `cursor`, `pageSize`.
→ `data`: `{ projectId, hasNext, lastCursor, posts[] }`

### `GET /user/posts/{postId}` ✅
Rich single-post detail. → `data` includes:
`{ postId, title, content, htmlContent, registerId, registerName, registeredDateTime,
   remarks[], attachments[], imageAttachments[], todos[], schedules[], tasks[], subTasks[],
   votes[], projectColumns[], raw }`
A post is the container for its tasks/todos/schedules/comments.

### `GET /user/posts/projects/{projectId}/tasks/filter` ✅
Task board query. Query params:
`cursor` (0-based), `pageSize` (1–100, default 50), `searchWord`, `upTaskId` (parent task),
`mode` (e.g. `TREE`), `treeModeYn` (`Y`/`N`),
`filterRecords` (JSON array string: `[{ "COLUMN_SRNO": "12", "OPERATOR_TYPE": "IN", "FILTER_DATA": "19171,19172" }]`).
→ `data`: `{ hasNext, lastCursor, mode, tasks[], groupAggregates }`
`tasks[]`: `{ taskId, postId, projectId, projectTitle, upTaskId, subTaskCount, managerYn,
   content, columns[] }` — each `columns[]` is `{ columnId, columnType, columnData[] }`
   (STATUS column's `columnData[].optionName` = current status, etc.)

### `POST /user/posts/projects/{projectId}` ✅
Create a post (게시글). Body:
```json
{ "title": "구매 요청서", "contents": "본문",
  "status": "request",            // request|progress|feedback|complete|hold (optional)
  "priority": "high",             // low|normal|high|urgent (optional)
  "workers": [{ "workerId": "tyler@company.name" }],   // optional
  "files": [{ "fileName": "f.txt", "fileContents": "<base64>" }],        // optional
  "imageFiles": [{ "fileName": "i.png", "fileContents": "<base64>" }],   // optional
  "viewPermission": "all" }       // all|admin (default all)
```
Required: `title`, `contents`. → `data`: `{ projectId, postId, tinyUrl }`

### `POST /user/posts/projects/{projectId}/tasks` ✅
Create a task (업무). Body:
```json
{ "title": "디자인 시안", "contents": "설명",
  "status": "request",            // required: request|progress|feedback|complete|hold
  "priority": "high",             // optional: low|normal|high|urgent
  "startDate": "20260615",        // optional YYYYMMDD
  "endDate": "20260620",          // optional YYYYMMDD
  "workers": [{ "workerId": "qortkdgus95" }] }   // optional; must be project participants
```
Required: `title`, `contents`, `status`. → `data`: `{ projectId, postId, taskId, tinyUrl }`

### `PATCH /user/posts/projects/{projectId}/tasks/{taskId}/status` ✅
`{ "status": "progress" }`  (request|progress|feedback|complete|hold)

### `PATCH /user/posts/projects/{projectId}/tasks/{taskId}/start-date` ✅
`{ "startDate": "20260615" }`  (YYYYMMDD)

### `PATCH /user/posts/projects/{projectId}/tasks/{taskId}/end-date` ✅
`{ "endDate": "20260620" }`  (YYYYMMDD)

### `PATCH /user/posts/projects/{projectId}/tasks/{taskId}/priority` ✅
`{ "priority": "high" }`  (low|normal|high|urgent)

### `PATCH /user/posts/projects/{projectId}/tasks/{taskId}/worker` ✅
`{ "workers": [{ "workerId": "qortkdgus95" }] }`  (must be project participants → else 412)

### `POST /user/posts/projects/{projectId}/schedules` ✅
Create a schedule on a project post. Body:
```json
{ "title": "킥오프 미팅",
  "isAllDay": false,                  // required BOOLEAN (true/false) — not "Y"/"N"
  "startDateTime": "20260618093000",  // required YYYYMMDDHHmmss (14)
  "endDateTime": "20260618103000",    // required (14)
  "memo": "메모",                      // optional
  "attendance": [{ "attendanceId": "tyler@company.name" }],  // optional; must be participants
  "viewPermission": "all" }           // all|admin
```
Required: `title`, `isAllDay`, `startDateTime`, `endDateTime`. → `data`: `{ projectId, postId, tinyUrl }`

### `POST /user/posts/projects/{projectId}/todos` ✅
Create a todo list. Body:
```json
{ "title": "주간 준비",
  "todoList": [                       // required, 1–50 items
    { "contents": "보고서 작성", "endDate": "20260620" },   // contents required; endDate YYYYMMDD optional
    { "contents": "회의실 예약" }
  ],
  "viewPermission": "all" }
```
Required: `title`, `todoList[].contents`. → `data`: `{ projectId, postId, tinyUrl }`

---

## User Calendars

### `GET /user/calendars` ✅
→ `data`: `{ editableCalendars[], viewOnlyCalendars[], projectCalendars[] }`
`editableCalendars[]`: `{ calendarSrno, calendarName, calendarType, customCalendarName,
   userPermission, calendarVisibilityYn, calendarColor, calendarRole, colaboSrno, rgsrId }`

### `GET /user/calendars/default` ✅
→ `data`: `{ calendarId }`

### `GET /user/calendars/subscribables` ✅
Search subscribable calendars. Query: `searchWord` (required).
→ `data`: `{ hasNext, lastCursor, calendars[] }`

### `GET /user/calendars/events` ✅
Events in a range. Query (both required, 14-digit): `startDateTime`, `endDateTime`.
→ `data`: `{ hasNext, lastCursor, events[] }`
`events[]`: `{ eventSrno, calendarSrno, eventName, eventBody, eventStartDateTime,
   eventFinishDateTime, allDayYn, privateYn, publicYn, gmtTime, timezone, calendarName, ... }`

### `GET /user/calendars/events/{eventSrno}` ✅
Single event detail.

### `POST /user/calendars/events` ✅
Create an event. Body:
```json
{ "calendarSrno": "1697870",            // required
  "eventName": "전사 회의",              // required
  "allDayYn": "N",                       // required STRING "Y"/"N"
  "gmtTime": "GMT+09:00",                // required
  "publicYn": "Y",                       // required Y/N
  "publicNameYn": "Y",                   // required Y/N
  "eventStartTimestamp": "20260618093000",   // required YYYYMMDDHHmmss (14) — note "Timestamp"
  "eventFinishTimestamp": "20260618103000",  // required (14)
  "eventBody": "본문",                    // optional
  "location": "회의실 A",                 // optional
  "attendances": [{ "attendanceType": "EMAIL", "attendanceInfo": "flow@flow.team", "attendanceName": "홍길동" }],
  "notifications": [{ "notificationType": "ALARM", "notificationTime": "10" }],
  "repeatEvents": [{ "repeatType": "WEEKLY", "repeatPeriod": "1", "repeatDays": "MO,WE,FR", "endDateTime": "20260630235959" }] }
```
Required: `calendarSrno, eventName, allDayYn, gmtTime, publicYn, publicNameYn, eventStartTimestamp, eventFinishTimestamp`.
→ `data`: `{ eventSrno, repeatSrno }`

### `PATCH /user/calendars/events/{eventSrno}` ⚪
Update event. Body likely mirrors POST — unverified.

### `DELETE /user/calendars/events/{eventSrno}` ✅
Delete an event. (Verified: create → delete round-trip works.)

---

## User Search

All require `searchWord`. Events search additionally requires the 14-digit range.

### `GET /user/search/projects?searchWord=…` ✅
→ `data`: `{ hasNext, score, pageTargetId, projects[] }`

### `GET /user/search/employees?searchWord=…` ✅
→ `data`: `{ hasNext, lastCursor, employees[] }`

### `GET /user/search/posts?searchWord=…` ✅
→ `data`: `{ hasNext, score, pageTargetId, posts[] }`

### `GET /user/search/events?searchWord=…&startDateTime=…&endDateTime=…` ✅
14-digit datetimes required. → `data`: `{ hasNext, lastCursor, events[] }`

---

## User Alarms

### `GET /user/alarms` ✅
→ `data.alarms`: `{ hasNext, lastCursor, alarms[] }`
`alarms[]`: `{ alarmId, projectId, postId, remarkId, replyId, receiverId, registerId,
   registerName, registeredDateTime, message, content, readYn, alarmType, mentionYn,
   registrantYn, workerYn }`
Unread = `readYn === "N"`.

### `PATCH /user/alarms/read` ⚪
Mark a single alarm read. Body likely `{ alarmId }` — unverified (avoid casual use).

### `PATCH /user/alarms/read/all` ⚪
Mark ALL alarms read. Destructive to inbox state — use deliberately.

---

## Common conventions

- **Auth:** `x-flow-api-key` header. Invalid key → `401 UNAUTHORIZED_ERROR`.
- **Paging:** `cursor` in, `{ hasNext, lastCursor }` out; loop until `hasNext === false`.
- **Dates:** tasks/todos `YYYYMMDD`; schedules/events/search `YYYYMMDDHHmmss`.
- **All-day flag type differs:** schedule `isAllDay` boolean vs event `allDayYn` "Y"/"N".
- **Event create vs read field names:** create `eventStart/FinishTimestamp`; read `eventStart/FinishDateTime`.
- **Participants gate:** assignees/attendees must belong to the project (else `412`).
- **No delete for posts/tasks/schedules/todos** — only calendar events are deletable.
