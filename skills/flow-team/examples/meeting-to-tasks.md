# Recipe: Meeting Notes → Tasks (회의록 → 업무 자동 생성)

Turn raw meeting notes into assigned Flow tasks.

## Goal

Paste meeting notes; the agent extracts action items, resolves assignees, and (after
confirmation) creates a task per item in the right project.

## Steps

1. **Pick the target project** — `flow.myProjects()`, or ask the user which project.
2. **Extract action items** from the notes: for each, a title, a short description, an
   owner (a name), and a due date if mentioned.
3. **Resolve each owner to a userId** — `flow.findEmployees(name)` → take the matching
   `userId`. If ambiguous, ask the user which person.
4. **Confirm the plan** — show the proposed tasks as a table (title / owner / due) and
   get a yes before writing.
5. **Create each task** — `flow.createTask(projectId, { title, contents, status: "request",
   priority, endDate, workers: [{ workerId }] })`.
   - Dates are `YYYYMMDD`.
   - Assignees must be participants of the project, or the call returns `412` — verify
     with `flow.participants(projectId)` and tell the user who needs to be added.
6. **Report** — list created tasks with their `tinyUrl` from each response.

## Notes

- Don't invent owners or dates — only use what the notes state or the user confirms.
- This writes real tasks. Always confirm step 4 before step 5.
