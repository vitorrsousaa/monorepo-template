# Feature: Recurring Tasks

**Status:** Draft
**Scope:** Large — touches contracts, API domain, DynamoDB, SPA form/hooks/cache
**Date:** 2026-03-26

---

## 1. Problem Statement

Users need tasks that repeat on a schedule. When a recurring task is completed, the system should automatically create the next occurrence based on the recurrence rule. Currently, the SPA has a `RecurrencePanel` UI component with form fields, but the data is **not persisted** — it's omitted from the API call.

---

## 2. Requirements

### Functional

| ID | Requirement | Priority |
|----|-------------|----------|
| REC-01 | User can define recurrence when **creating** a task (frequency: daily/weekly/monthly/yearly) | Must |
| REC-02 | User can define **weekly days** (e.g., Mon+Wed+Fri) when frequency is `weekly` | Must |
| REC-03 | User can define **end condition**: never, on a specific date, or after N occurrences | Must |
| REC-04 | Recurrence data is **persisted** with the task in DynamoDB | Must |
| REC-05 | When **editing** a task, recurrence fields are pre-filled with saved values | Must |
| REC-06 | User can **modify** recurrence on an existing task | Must |
| REC-07 | When a recurring task is **completed**, the backend automatically creates the **next occurrence** | Must |
| REC-08 | Next occurrence inherits: title, description, priority, projectId, sectionId, and recurrence rule | Must |
| REC-09 | Next occurrence's `dueDate` is calculated based on frequency and previous `dueDate` (or completedAt if no dueDate) | Must |
| REC-10 | If end condition is `after_count`, decrement remaining count; stop creating when 0 | Must |
| REC-11 | If end condition is `on_date`, stop creating when next dueDate would exceed end date | Must |
| REC-12 | User can **remove** recurrence from a task (set enabled=false) | Must |
| REC-13 | Completing a non-recurring task works exactly as before (no regression) | Must |
| REC-14 | Recurring task shows a visual indicator (repeat icon) in task lists | Should |

### Non-Functional

| ID | Requirement |
|----|-------------|
| NF-01 | Next occurrence creation must be atomic with task completion (same DynamoDB transaction or fail-safe) |
| NF-02 | No new Lambda functions needed — logic lives in CompleteTaskService |
| NF-03 | Recurrence data stored as a nested map in DynamoDB (not a separate table) |

---

## 3. Data Model

### Recurrence Schema (new field on Task entity)

```typescript
interface Recurrence {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  weeklyDays?: number[];        // 0=Sun..6=Sat, only when frequency=weekly
  endType: "never" | "on_date" | "after_count";
  endDate?: string;             // ISO date, only when endType=on_date
  endCount?: number;            // remaining occurrences, only when endType=after_count
}
```

This matches the existing SPA form schema in `task-form.schema.ts`.

### Where it lives

- **Contracts:** `packages/contracts/src/tasks/entities/index.ts` — add `recurrence?: Recurrence | null`
- **DynamoDB:** stored as `recurrence` map attribute on the task item (no separate table/index needed)

---

## 4. Affected Layers (End-to-End)

### 4.1 Contracts (`packages/contracts`)

| File | Change |
|------|--------|
| `src/tasks/entities/index.ts` | Add `Recurrence` interface + `recurrence` field to `Task` |
| `src/tasks/create/schema.ts` | Add `recurrence` to `createTaskSchema` (optional) |
| `src/tasks/create/input.ts` | Add `recurrence` to `CreateTaskInput` |
| **NEW** `src/tasks/update/schema.ts` | Create `updateTaskSchema` (needed for editing tasks — **currently missing**) |
| **NEW** `src/tasks/update/input.ts` | `UpdateTaskInput` type |
| **NEW** `src/tasks/update/output.ts` | `UpdateTaskOutput` type |
| **NEW** `src/tasks/update/index.ts` | Barrel export |

### 4.2 API — Domain Layer

| File | Change |
|------|--------|
| `src/core/domain/task/task.ts` | Add `recurrence` field |
| `src/core/domain/todo/todo.ts` | Add `recurrence` field (legacy compat) |

### 4.3 API — Service Layer

| File | Change |
|------|--------|
| `services/create/service.ts` | Pass `recurrence` through to repository |
| **NEW** `services/update/service.ts` | Create UpdateTaskService (edit task fields including recurrence) |
| `services/complete/service.ts` | After completing, check recurrence → spawn next task via `createService` or `repository.create` |

### 4.4 API — Repository Layer

| File | Change |
|------|--------|
| `tasks-dynamo-repository.ts` | `create()` — persist `recurrence` map; **NEW** `update()` method |
| `task-mapper.ts` | `toDatabase()` / `toDomain()` — handle `recurrence` nested map |

### 4.5 API — Controller + Handler Layer

| File | Change |
|------|--------|
| `controllers/create/controller.ts` | Pass `recurrence` from body to service |
| **NEW** `controllers/update/controller.ts` | New controller for updating task fields |
| **NEW** `functions/tasks/update-task/handler.ts` | New Lambda handler: `PUT /tasks/{taskId}` |
| **NEW** `functions/tasks/update-task/index.ts` | Serverless function config |

### 4.6 SPA — App Layer

| File | Change |
|------|--------|
| `mappers/create-tasks.ts` | Include `recurrence` in mapping (currently omitted) |
| **NEW** `mappers/update-tasks.ts` | Map form data to UpdateTaskInput |
| **NEW** `services/update-task.ts` | HTTP PUT call to update task |
| **NEW** `hooks/use-update-task.ts` | TanStack mutation for updating task |
| `hooks/use-create-tasks.ts` | Pass `recurrence` in optimistic data |

### 4.7 SPA — View Layer

| File | Change |
|------|--------|
| `forms/task/task-form.hook.ts` | When editing, populate `recurrence` from existing task data |
| `forms/task/task-form.tsx` | Already has `RecurrencePanel` — no changes needed |
| `forms/task/task-form.schema.ts` | Already has `recurrence` — no changes needed |
| Task list components | Add recurring indicator icon (Repeat icon from lucide) |

---

## 5. Next Occurrence Logic (Backend)

```
When CompleteTaskService.execute(task) is called:
  1. Complete the task (existing logic — set completed=true, completedAt=now)
  2. IF task.recurrence?.enabled === true:
     a. Calculate nextDueDate based on:
        - frequency + current dueDate (or completedAt if no dueDate)
        - For weekly: find next matching weekday from weeklyDays
     b. Check end conditions:
        - endType === "on_date" && nextDueDate > endDate → STOP
        - endType === "after_count" && endCount <= 1 → STOP
     c. If not stopped, create new task:
        - Copy: title, description, priority, projectId, sectionId
        - Set: dueDate = nextDueDate, completed = false
        - Set: recurrence = same rule (but if after_count, decrement endCount)
     d. Return the new task alongside the completed one
```

### Date Calculation Rules

| Frequency | Next Due Date |
|-----------|---------------|
| `daily` | +1 day |
| `weekly` | Next matching day from `weeklyDays` (sorted, wraps around week) |
| `monthly` | Same day next month (clamp to month-end if needed, e.g., Jan 31 → Feb 28) |
| `yearly` | Same day next year (handle Feb 29 → Feb 28 on non-leap years) |

---

## 6. API Endpoint Changes

| Method | Path | Status | Purpose |
|--------|------|--------|---------|
| POST | `/tasks/create` | EXISTS — modify | Add `recurrence` to input |
| PATCH | `/tasks/{taskId}/completion` | EXISTS — modify | Return `nextTask` alongside completed task if recurrence triggered |
| **PUT** | `/tasks/{taskId}` | **NEW** | General task update (title, description, priority, dueDate, recurrence, etc.) |

### Completion Response Change

Current: `{ task: Task }` (the completed task)
New: `{ task: Task, nextTask?: Task }` (completed + optional next occurrence)

---

## 7. Gray Areas to Discuss

| # | Question | Default Assumption |
|---|----------|--------------------|
| GA-01 | Should the update endpoint (PUT /tasks/{taskId}) be part of this feature, or split into a separate feature? | Include — editing recurrence requires it, and it's a prerequisite |
| GA-02 | When completing a weekly task on a non-scheduled day, should next occurrence be the next scheduled day, or the same weekday next week? | Next scheduled day from `weeklyDays` after today |
| GA-03 | Should the completion response include the `nextTask` so the SPA can show it immediately, or should the SPA re-fetch? | Include in response — avoids extra round-trip |
| GA-04 | Should uncompleting a task (toggling back) delete the spawned next occurrence? | No — once created, the next occurrence is independent |
| GA-05 | If a task has no `dueDate`, what's the base date for calculating next occurrence? | Use `completedAt` as the base |
| GA-06 | Should the recurring indicator be visible in all list views (inbox, today, project detail)? | Yes — universal indicator |

---

## 8. Out of Scope

- Recurring task history/chain tracking (linking occurrences)
- Custom intervals (e.g., "every 3 days", "every 2 weeks")
- Time-of-day scheduling
- Notification/reminders for recurring tasks
- Bulk editing recurrence across multiple tasks

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| No update endpoint exists today | Create it as part of this feature — it's a prerequisite |
| DynamoDB transaction limits (completion + create in one tx) | Both operations are on the same partition (same userId); DynamoDB supports this |
| Infinite recurrence (endType=never) creates tasks forever | Each completion only creates ONE next task — growth is bounded by user action |
| Monthly/yearly edge cases (31st, Feb 29) | Clamp to month-end; well-tested date utility |
