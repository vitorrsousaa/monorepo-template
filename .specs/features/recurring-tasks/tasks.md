# Recurring Tasks — Tasks

**Design:** `.specs/features/recurring-tasks/design.md`
**Status:** Draft

---

## Execution Plan

```
Phase 1: Data Model (Sequential — foundation for everything)
  T1 → T2 → T3

Phase 2: Backend Core (Parallel after T3)
       ┌→ T4 (RecurrenceDateCalculator) → T4b (Tests DateCalculator)
  T3 ──┼→ T5 (Repository update/updateField)
       └→ T6 (UpdateTaskService + Controller) → T6b (Tests UpdateTaskService)

Phase 3: Backend Recurrence (Sequential — depends on T4, T5)
  T4 + T5 → T7 (RecurrenceService) → T7b (Tests RecurrenceService)

Phase 4: Backend Complete + Wiring (Sequential)
  T7 → T8 → T8b (Tests CompleteTaskService)
            ├→ T8c (Tests CreateTasksService) [P]
            └→ T8d (Tests UpdateTaskCompletionService) [P]
  then → T9 → T10

Phase 5: SPA — Data Layer (Parallel after T10)
       ┌→ T11 (Create mapper — add recurrence)
  T10 ─┼→ T12 (Update task service + mapper)
       └→ T13 (useUpdateTask hook)

Phase 6: SPA — Completion Flow (Sequential)
  T13 → T14 (useUpdateTaskCompletion — handle nextTask)

Phase 7: SPA — UI (Parallel after T14)
       ┌→ T15 (Task form edit — populate recurrence)
  T14 ─┤
       └→ T16 (Recurrence indicator on task cards)
```

---

## Task Breakdown

### T1: Add Recurrence type to contracts entity

**What:** Add `Recurrence` interface and `recurrence` + `nextTaskId` fields to the `Task` entity in contracts
**Where:** `packages/contracts/src/tasks/entities/index.ts`
**Depends on:** None
**Requirement:** REC-04

**Done when:**
- [ ] `Recurrence` interface exported with: `enabled`, `frequency`, `weeklyDays?`, `endType`, `endDate?`, `endCount?`
- [ ] `Task` has `recurrence: Recurrence | null` and `nextTaskId: string | null`
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T2: Add recurrence to create schema + create update schema

**What:** Add `recurrence` as optional field to `createTaskSchema`; create new `update` schema/input/output in contracts
**Where:**
- `packages/contracts/src/tasks/create/schema.ts` (modify)
- `packages/contracts/src/tasks/update/` (new — `schema.ts`, `input.ts`, `output.ts`, `index.ts`)
**Depends on:** T1
**Requirement:** REC-01, REC-06

**Done when:**
- [ ] `createTaskSchema` includes optional `recurrence` with nested validation (frequency enum, weeklyDays array, endType enum, etc.)
- [ ] `updateTaskSchema` created with all fields optional (partial update)
- [ ] `UpdateTaskInput` and `UpdateTaskOutput` types exported
- [ ] Validation constants exported (`RECURRENCE_FREQUENCIES`, `RECURRENCE_END_TYPES`, `WEEKLY_DAYS_MIN/MAX`)
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T3: Update completion output type

**What:** Add optional `nextTask` field to `UpdateTaskCompletionOutput`
**Where:** `packages/contracts/src/tasks/completion/output.ts`
**Depends on:** T1
**Requirement:** REC-07

**Done when:**
- [ ] `UpdateTaskCompletionOutput` has `nextTask?: Task`
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T4: Create RecurrenceDateCalculator [P]

**What:** Pure utility functions for calculating next due date based on frequency
**Where:** `apps/api/src/app/modules/tasks/services/recurrence/date-calculator.ts`
**Depends on:** T1
**Requirement:** REC-09

**Done when:**
- [ ] `calculateNextDueDate(task)` returns ISO string or null
- [ ] Daily: adds 1 day to base date
- [ ] Weekly: finds next day in `weeklyDays` from today (wraps around week)
- [ ] Monthly: same day next month, clamped to month-end (31→28/30)
- [ ] Yearly: same day next year, handles Feb 29→28
- [ ] Base date = `dueDate` when present, `completedAt` when not
- [ ] Weekly always uses "from today" logic regardless of base
- [ ] No tests in this task — see T4b

**Verify:**
```bash
pnpm typecheck
```

---

### T4b: Unit tests for RecurrenceDateCalculator

**What:** Comprehensive unit tests for all frequency types and edge cases
**Where:** `apps/api/src/app/modules/tasks/services/recurrence/date-calculator.test.ts`
**Depends on:** T4
**Requirement:** REC-09

**Pattern:** Use `vi.useFakeTimers()` + `vi.setSystemTime()` to control "today" for weekly logic. Use `buildTask()` with recurrence overrides.

**Done when:**
- [ ] Daily: base date + 1 day (with dueDate and without)
- [ ] Weekly: next valid day from today with single day (e.g., Mon only)
- [ ] Weekly: next valid day from today with multiple days (e.g., Mon+Wed+Fri)
- [ ] Weekly: wrap-around (today is Sat, next valid is Mon)
- [ ] Weekly: completed on a non-scheduled day → picks next scheduled day from today
- [ ] Weekly: completed late (dueDate in the past) → still picks next from today
- [ ] Monthly: same day next month (e.g., Jan 15 → Feb 15)
- [ ] Monthly: clamp to month-end (Jan 31 → Feb 28)
- [ ] Monthly: clamp in leap year (Jan 31 → Feb 29)
- [ ] Yearly: same day next year
- [ ] Yearly: Feb 29 in leap year → Feb 28 in non-leap year
- [ ] Base date fallback: uses `completedAt` when `dueDate` is null
- [ ] Returns null when task has no recurrence

**Verify:**
```bash
cd apps/api && pnpm vitest run src/app/modules/tasks/services/recurrence/date-calculator.test.ts
```

---

### T5: Add update + updateField methods to repository [P]

**What:** Add `update()` and `updateField()` methods to repository interface and DynamoDB implementation
**Where:**
- `apps/api/src/data/protocols/tasks/tasks-repository.ts` (modify interface)
- `apps/api/src/infra/db/dynamodb/repositories/tasks/tasks-dynamo-repository.ts` (implement)
**Depends on:** T1
**Requirement:** REC-04, REC-06

**Done when:**
- [ ] `ITasksRepository` has `update()` and `updateField()` method signatures
- [ ] `update()` uses DynamoDB `UpdateItem` for same-PK updates (title, description, priority, dueDate, recurrence, sectionId)
- [ ] `update()` handles project change (PK change) via transact delete+put
- [ ] `updateField()` uses lightweight `UpdateItem` for single-field patches (nextTaskId)
- [ ] DynamoDB mapper handles `recurrence` nested map + `nextTaskId` in `toDatabase()` and `toDomain()`
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T6: Create UpdateTaskService + UpdateTaskController [P]

**What:** New service and controller for general task editing (`PUT /tasks/{taskId}`)
**Where:**
- `apps/api/src/app/modules/tasks/services/update-task/service.ts`
- `apps/api/src/app/modules/tasks/controllers/update-task/controller.ts`
**Depends on:** T2, T5
**Requirement:** REC-05, REC-06, REC-12

**Done when:**
- [ ] `UpdateTaskService.execute(input)` fetches task, applies partial updates, calls `repository.update()`
- [ ] `UpdateTaskController` validates body with `updateTaskSchema`, extracts `taskId` from params
- [ ] Setting `recurrence: null` or `recurrence.enabled: false` removes recurrence
- [ ] No tests in this task — see T6b

**Verify:**
```bash
pnpm typecheck
```

---

### T6b: Unit tests for UpdateTaskService

**What:** Unit tests for the update task service covering field updates, recurrence changes, and edge cases
**Where:** `apps/api/src/app/modules/tasks/services/update-task/service.test.ts`
**Depends on:** T6
**Requirement:** REC-05, REC-06, REC-12

**Pattern:** Use `mockTasksRepository()`, `buildTask()`, `sut` convention. Follow `create/service.test.ts` pattern.

**Done when:**
- [ ] Updates title successfully
- [ ] Updates description (string and null)
- [ ] Updates priority (value and null)
- [ ] Updates dueDate (value and null)
- [ ] Adds recurrence to a task that had none
- [ ] Modifies existing recurrence (change frequency)
- [ ] Removes recurrence (`recurrence: null`)
- [ ] Removes recurrence (`recurrence.enabled: false`)
- [ ] Throws `TaskNotFound` when task doesn't exist
- [ ] Calls `repository.update()` with correct arguments
- [ ] Partial update: only sends changed fields

**Verify:**
```bash
cd apps/api && pnpm vitest run src/app/modules/tasks/services/update-task/service.test.ts
```

---

### T7: Create RecurrenceService

**What:** Service that creates next task occurrence when a recurring task is completed
**Where:** `apps/api/src/app/modules/tasks/services/recurrence/service.ts`
**Depends on:** T4, T5
**Requirement:** REC-07, REC-08, REC-09, REC-10, REC-11

**Done when:**
- [ ] `createNextOccurrence(task)` returns `{ nextTask }` or `null`
- [ ] Checks `recurrence.enabled` guard
- [ ] Checks `nextTaskId` duplicate guard (via `repo.getByUserId`)
- [ ] Uses `RecurrenceDateCalculator` for next date
- [ ] Checks end conditions: `on_date` (nextDate > endDate → null), `after_count` (endCount <= 1 → null)
- [ ] Creates next task with inherited fields (title, description, priority, projectId, sectionId, recurrence)
- [ ] Decrements `endCount` when `endType === "after_count"`
- [ ] Calls `repo.updateField` to set `nextTaskId` on completed task
- [ ] No tests in this task — see T7b

**Verify:**
```bash
pnpm typecheck
```

---

### T7b: Unit tests for RecurrenceService

**What:** Unit tests for recurrence orchestration: guard checks, next task creation, end conditions, duplicate prevention
**Where:** `apps/api/src/app/modules/tasks/services/recurrence/service.test.ts`
**Depends on:** T7
**Requirement:** REC-07, REC-08, REC-10, REC-11, REC-13

**Pattern:** Use `mockTasksRepository()`, `buildTask()`. Mock `RecurrenceDateCalculator` to isolate service logic from date math. Use `vi.useFakeTimers()` where needed.

**Done when:**
- [ ] Returns null when `recurrence` is null
- [ ] Returns null when `recurrence.enabled` is false
- [ ] Returns null when `nextTaskId` exists AND next task is pending (duplicate guard)
- [ ] Creates next task when `nextTaskId` exists BUT next task is completed (re-creates)
- [ ] Creates next task when `nextTaskId` is null (first completion)
- [ ] Next task inherits: title, description, priority, projectId, sectionId
- [ ] Next task has calculated dueDate from DateCalculator
- [ ] Next task has same recurrence rule
- [ ] `endType === "after_count"`: decrements `endCount` by 1
- [ ] `endType === "after_count"` with `endCount === 1`: returns null (last occurrence)
- [ ] `endType === "on_date"`: returns null when nextDueDate > endDate
- [ ] `endType === "on_date"`: creates task when nextDueDate <= endDate
- [ ] `endType === "never"`: always creates next task
- [ ] Calls `repo.updateField` to set `nextTaskId` on completed task
- [ ] Calls `repo.create` with correct arguments for next task

**Verify:**
```bash
cd apps/api && pnpm vitest run src/app/modules/tasks/services/recurrence/service.test.ts
```

---

### T8: Modify CompleteTaskService to trigger recurrence

**What:** After completing a task, call `RecurrenceService.createNextOccurrence()` and include `nextTask` in output
**Where:** `apps/api/src/app/modules/tasks/services/complete-task/service.ts`
**Depends on:** T7
**Requirement:** REC-07, REC-13

**Done when:**
- [ ] `execute()` calls `recurrenceService.createNextOccurrence(completedTask)` after completion
- [ ] Return type includes `nextTask?: Task`
- [ ] Non-recurring tasks work exactly as before (no regression)
- [ ] No tests in this task — see T8b

**Verify:**
```bash
pnpm typecheck
```

---

### T8b: Unit tests for CompleteTaskService (modified)

**What:** Update existing tests + add new tests for recurrence integration in CompleteTaskService
**Where:** `apps/api/src/app/modules/tasks/services/complete-task/service.test.ts`
**Depends on:** T8
**Requirement:** REC-07, REC-13

**Pattern:** Existing test file already has tests — extend it. Mock `RecurrenceService` as a new dependency. Use `vi.useFakeTimers()` (already used in this file).

**Done when:**
- [ ] Existing tests still pass (no regression)
- [ ] Non-recurring task: `recurrenceService.createNextOccurrence` is called but returns null → result has no `nextTask`
- [ ] Recurring task: `recurrenceService.createNextOccurrence` returns `{ nextTask }` → result includes `nextTask`
- [ ] Recurring task at end condition: `recurrenceService.createNextOccurrence` returns null → result has no `nextTask`
- [ ] Completion fields still set correctly (completed=true, completedAt, updatedAt)
- [ ] `repository.updateCompletion` still called with correct args

**Verify:**
```bash
cd apps/api && pnpm vitest run src/app/modules/tasks/services/complete-task/service.test.ts
```

---

### T8c: Update tests for CreateTasksService

**What:** Extend existing tests to cover the new `recurrence` field being passed through to the repository
**Where:** `apps/api/src/app/modules/tasks/services/create/service.test.ts`
**Depends on:** T8 (CreateTasksService now accepts recurrence from contracts change in T2)
**Requirement:** REC-01, REC-04

**Pattern:** Extend existing test file. Already uses `mockTasksRepository()`, `buildTask()`, `sut`. Add new `describe` block for recurrence scenarios.

**Done when:**
- [ ] Existing tests still pass (no regression)
- [ ] Creates task with `recurrence` field → `repository.create` called with recurrence data
- [ ] Creates task without `recurrence` (null/undefined) → `repository.create` called with `recurrence: null`
- [ ] Creates task with `recurrence.enabled: false` → passed through as-is
- [ ] Verifies all recurrence sub-fields are forwarded: frequency, weeklyDays, endType, endDate, endCount

**Verify:**
```bash
cd apps/api && pnpm vitest run src/app/modules/tasks/services/create/service.test.ts
```

---

### T8d: Update tests for UpdateTaskCompletionService

**What:** Extend existing tests to cover `nextTask` being returned when completing a recurring task
**Where:** `apps/api/src/app/modules/tasks/services/update-completion/service.test.ts`
**Depends on:** T8 (CompleteTaskService now returns `nextTask`)
**Requirement:** REC-07, REC-13

**Pattern:** Extend existing test file. Already uses `mockTasksRepository()`, mocks `completeTaskService` and `uncompleteTaskService`. Now `completeTaskService.execute` may return `{ task, nextTask }`.

**Done when:**
- [ ] Existing tests still pass (no regression)
- [ ] Completing a recurring task: `completeTaskService.execute` returns `{ task, nextTask }` → service returns both
- [ ] Completing a non-recurring task: `completeTaskService.execute` returns `{ task }` (no nextTask) → service returns only task
- [ ] Uncompleting a task: no change in behavior, no `nextTask` returned
- [ ] Verifies `nextTask` is propagated from `completeTaskService` to the caller without modification

**Verify:**
```bash
cd apps/api && pnpm vitest run src/app/modules/tasks/services/update-completion/service.test.ts
```

---

### T9: Create UpdateTask Lambda handler + serverless config

**What:** Lambda handler and serverless function definition for `PUT /tasks/{taskId}`
**Where:**
- `apps/api/src/server/functions/tasks/update-task/handler.ts`
- `apps/api/src/server/functions/tasks/update-task/index.ts`
- `apps/api/serverless.yml` (or `serverless/functions/`) — add function entry
**Depends on:** T6
**Requirement:** REC-06

**Done when:**
- [ ] Handler exports `handler` via `lambdaHttpAdapter(controller)`
- [ ] Serverless config defines `PUT /tasks/{taskId}` with Cognito authorizer
- [ ] Follows same pattern as `update-task-completion`
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T10: Wire factories for new services

**What:** Create factory files for `UpdateTaskService`, `UpdateTaskController`, `RecurrenceService`; modify `CompleteTaskService` factory
**Where:**
- `apps/api/src/factories/services/tasks/update-task.ts` (new)
- `apps/api/src/factories/services/tasks/recurrence.ts` (new)
- `apps/api/src/factories/controllers/tasks/update-task.ts` (new)
- `apps/api/src/factories/services/tasks/complete-task.ts` (modify — inject RecurrenceService)
**Depends on:** T6, T7, T8, T9

**Done when:**
- [ ] `makeUpdateTaskService()` wires repository
- [ ] `makeRecurrenceService()` wires repository + date calculator
- [ ] `makeCompleteTaskService()` injects `RecurrenceService`
- [ ] `makeUpdateTaskController()` wires service → controller
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T11: Update create task mapper to include recurrence [P]

**What:** Modify `mapTaskFormToCreateInput` to include `recurrence` field
**Where:** `apps/spa/src/modules/tasks/app/mappers/create-tasks.ts`
**Depends on:** T2
**Requirement:** REC-01

**Done when:**
- [ ] `recurrence` mapped from form schema to API input (enabled → full object, disabled → null)
- [ ] Date fields (endDate) converted to ISO string
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T12: Create update task service + mapper [P]

**What:** HTTP service for `PUT /tasks/{taskId}` and mapper from form schema to update input
**Where:**
- `apps/spa/src/modules/tasks/app/services/update-task.ts` (new)
- `apps/spa/src/modules/tasks/app/mappers/update-task.ts` (new)
**Depends on:** T2
**Requirement:** REC-06

**Done when:**
- [ ] `updateTask(taskId, input)` calls `PUT /tasks/{taskId}`
- [ ] `mapTaskFormToUpdateInput(formData)` maps all fields including recurrence
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T13: Create useUpdateTask hook [P]

**What:** TanStack Query mutation hook for updating task fields
**Where:** `apps/spa/src/modules/tasks/app/hooks/use-update-task.ts`
**Depends on:** T12
**Requirement:** REC-05, REC-06

**Done when:**
- [ ] Mutation calls `updateTask` service
- [ ] Optimistic update: patches task in inbox/project cache
- [ ] `onSuccess`: replaces with server data
- [ ] `onError`: restores snapshot
- [ ] Invalidates relevant query keys
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T14: Modify useUpdateTaskCompletion to handle nextTask

**What:** Update completion hook to optimistically insert next occurrence and replace with real data
**Where:** `apps/spa/src/modules/tasks/app/hooks/use-update-task-completion.ts`
**Depends on:** T3
**Requirement:** REC-07

**Done when:**
- [ ] `onMutate`: if task has `recurrence.enabled`, generates tempId + inserts next task in cache with `OptimisticState.PENDING`
- [ ] `onSuccess`: if `data.nextTask` exists, replaces tempId with real task
- [ ] `onError`: restores full snapshot (both completed task and next occurrence reverted)
- [ ] Non-recurring completion works exactly as before
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T15: Populate recurrence in task form edit mode [P]

**What:** When editing an existing task, populate the recurrence panel with saved recurrence data
**Where:** `apps/spa/src/modules/tasks/view/forms/task/task-form.hook.ts`
**Depends on:** T1
**Requirement:** REC-05

**Done when:**
- [ ] Edit mode receives task with `recurrence` field
- [ ] Form defaults populated: `enabled`, `frequency`, `weeklyDays`, `endType`, `endDate`, `endCount`
- [ ] `endDate` converted from ISO string to `Date` object for date picker
- [ ] Form submits via `useUpdateTask` mutation (not create)
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

### T16: Add recurrence indicator on task cards [P]

**What:** Show `Repeat` icon with tooltip on task cards in all list views
**Where:** Existing task card/row components (inbox, today, project detail)
**Depends on:** T1
**Requirement:** REC-14

**Done when:**
- [ ] `Repeat` icon from lucide-react shown when `task.recurrence?.enabled`
- [ ] Tooltip displays `formatRecurrencePreview(task.recurrence)` text
- [ ] Icon visible in inbox, today, project detail, and upcoming views
- [ ] Icon does NOT appear for non-recurring tasks
- [ ] `pnpm typecheck` passes

**Verify:**
```bash
pnpm typecheck
```

---

## Parallel Execution Map

```
Phase 1 — Data Model (Sequential):
  T1 → T2 → T3

Phase 2 — Backend Core (Parallel):
  T1 done, then:
    ├── T4 [P] → T4b (tests DateCalculator)
    ├── T5 [P] — Repository methods
    └── T6 [P] → T6b (tests UpdateTaskService)

Phase 3 — Backend Recurrence (Sequential):
  T4 + T5 → T7 → T7b (tests RecurrenceService)

Phase 4 — Backend Complete + Wiring:
  T7 → T8 → then parallel:
    ├── T8b (tests CompleteTaskService) [P]
    ├── T8c (tests CreateTasksService) [P]
    └── T8d (tests UpdateTaskCompletionService) [P]
  then → T9 → T10

Phase 5 — SPA Data Layer (Parallel):
  T2 done, then:
    ├── T11 [P] — Create mapper
    ├── T12 [P] → T13 — Update service/hook
    └── T14 — Completion hook (needs T3)

Phase 6 — SPA UI (Parallel):
  T1 done, then:
    ├── T15 [P] — Form edit mode (needs T13)
    └── T16 [P] — Recurrence indicator
```

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T1: Recurrence type | 1 file, 1 interface + 2 fields | OK |
| T2: Create/Update schemas | 2 locations (1 modify + 1 new dir) | OK — cohesive |
| T3: Completion output | 1 field in 1 file | OK |
| T4: DateCalculator | 1 file, pure functions | OK |
| T4b: Tests DateCalculator | 1 test file, 13+ test cases | OK |
| T5: Repository methods | 2 files (interface + impl) | OK — cohesive pair |
| T6: UpdateTask service+controller | 2 files, same pattern | OK — cohesive pair |
| T6b: Tests UpdateTaskService | 1 test file, 11 test cases | OK |
| T7: RecurrenceService | 1 file, 1 class | OK |
| T7b: Tests RecurrenceService | 1 test file, 15 test cases | OK |
| T8: CompleteTask modification | 1 file, add call | OK |
| T8b: Tests CompleteTaskService | 1 test file (extend existing), 6 test cases | OK |
| T8c: Tests CreateTasksService | 1 test file (extend existing), 5 test cases | OK |
| T8d: Tests UpdateTaskCompletionService | 1 test file (extend existing), 5 test cases | OK |
| T9: Lambda handler | 2 files + config | OK — boilerplate |
| T10: Factories | 4 files, boilerplate | OK — all wiring |
| T11: Create mapper | 1 file, add field | OK |
| T12: Update service+mapper | 2 files, same pattern | OK — cohesive pair |
| T13: useUpdateTask hook | 1 file | OK |
| T14: Completion hook modification | 1 file | OK |
| T15: Form edit populate | 1 file | OK |
| T16: Recurrence indicator | Small additions to existing files | OK |
