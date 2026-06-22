# Mini Task Tracker Status

## Current Status

The core backend and frontend scope from the original feature plan is implemented.

Completed areas:

- Backend Express application scaffolded with:
  - `helmet`
  - `cors`
  - centralized error handling
  - shared success/error response formatter
  - route/controller/service separation
- MySQL + Sequelize integration added
- Umzug migration flow added
- Optional request logging added
- Task APIs implemented:
  - create
  - list
  - get by id
  - update
  - complete
  - soft delete
  - summary
- Backend validation implemented with `zod`
- Frontend routing, layout, navigation, and API integration implemented
- Frontend task flows implemented:
  - create
  - list
  - search
  - filter
  - view detail
  - edit
  - complete
  - soft delete with confirmation
- Frontend validation implemented with `zod`
- Calendar restrictions and styling added
- Rich-text description editing and rendering added
- Loading, empty, error, and toast states added

## Implemented Backend Contract

Base path: `/api/tasks`

- `GET /api/tasks`
- `GET /api/tasks/summary`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/complete`
- `DELETE /api/tasks/:id`

All responses use:

```json
{
  "message": "Task fetched successfully",
  "status": "success",
  "data": {},
  "success": true
}
```

Errors use the same top-level shape:

```json
{
  "message": "Validation failed",
  "status": "error",
  "data": {
    "errors": {}
  },
  "success": false
}
```

## Data Model

```ts
type TaskStatus = 'open' | 'completed'
type TaskPriority = 'low' | 'medium' | 'high'

type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  deletedAt?: string | null
}
```

Notes:

- delete is soft delete
- list and summary exclude deleted tasks
- `updatedAt` refreshes on edit and completion
- past due dates are blocked in the frontend calendar

## Validation Rules

Backend and frontend both validate with `zod`.

- `title`
  - required
  - trimmed
  - minimum length `1`
- `description`
  - optional
  - stored as string
- `priority`
  - `low | medium | high`
- `dueDate`
  - `YYYY-MM-DD` string or `null`
- query `status`
  - `all | open | completed`
- query `search`
  - trimmed string

## Frontend Structure In Use

- `src/pages/TasksPage.tsx`
- `src/routes/AppRouter.tsx`
- `src/service/http.ts`
- `src/service/task.service.ts`
- `src/components/tasks/*`
- `src/components/ui/*`
- `src/schemas/task.ts`
- `src/types/task.ts`
- `src/utils/*`

## Completed Acceptance Criteria

- user can create a task with valid title
- empty title is blocked on client and server
- task list shows title, description preview, priority, status, due date, and actions
- open task can be marked completed
- completed state is visually clear
- tasks can be filtered by `All`, `Open`, `Completed`
- tasks can be searched by title
- task can be edited by id
- edit and view flows show `createdAt` and `updatedAt`
- task can be deleted by id only after confirmation
- priority and due date are stored and displayed
- task summary counts are visible and correct
- frontend and backend both use `zod` validation
- every API success response follows the shared response contract
- every API failure response follows the shared error contract

## Remaining Work

No major product feature from the original scope is still missing.

Recommended next work is hardening:

1. Expand frontend automated tests around full page flows and service mocking.
2. Expand backend automated tests around summary, search, and soft-delete edge cases.
3. Consider shared contracts between frontend and backend to remove duplicated schemas.
4. Continue UX polish for narrow screens and editor ergonomics if product requirements grow.

## Latest Additions

- richer description editing using a real editor instead of a plain textarea
- safer HTML sanitization before rendering description content
- debounced search refresh behavior
- icon-based action controls in the table
- hidden scrollbars with preserved scrolling
- calendar selection fixes, disabled past dates, and stronger disabled styling
- frontend test setup with Vitest and Testing Library
