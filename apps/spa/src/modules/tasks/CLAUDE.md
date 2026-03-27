# tasks module (SPA)

Mutations and cache behaviour for **tasks** (wire DTO `Task` from `@repo/contracts`).

## `useUpdateTaskCompletion`

Variables extend the PATCH body with:

- `taskId` — path param
- `nextCompleted` — **UI-only**; desired checkbox state after the click. Not sent to the API (the API toggles from persisted state; the client still sends the correct `projectId` for context).

```ts
toggleTaskCompletion({
  taskId: task.id,
  projectId: task.projectId ?? null, // null = inbox context
  nextCompleted: checked,
});
```

### Optimistic updates

1. **`cancelRelatedQueries` first**, then snapshot, then `setQueryData` / cache helpers (see root SPA `CLAUDE.md`).
2. **Inbox** (`projectId == null`): `tasksInboxCache.patchTaskCompletionOptimistic` sets `completed` and `completedAt` (keeps the row in the list). **`onSuccess`** merges `data.task` via `replaceTaskFromServer`.
3. **Project detail** (`projectId` set): `projectDetailCache(queryClient, projectId).patchTaskCompletionOptimistic(taskId, nextCompleted)`; **`onSuccess`** replaces the task with `data.task` via `replaceTaskFromServer` (timestamps and `completedAt` from the server).

### Errors

Snapshots are restored with `restoreSnapshot`; user feedback uses `toast.error` and `AppError` / Axios message when available.

## Related files

| Concern | File |
|--------|------|
| Inbox cache | `app/cache/tasks-inbox.cache.ts` |
| Project detail task rows | `../projects/app/cache/project-detail.cache.ts` (`patchTaskCompletionOptimistic`, `replaceTaskFromServer`) |
| HTTP | `app/services/update-task-completion.ts` |


## Task ordering — server-side, do not re-sort client-side

The API (`get-today-tasks`) returns tasks **pre-sorted** within each project column:
`high → medium → low → null priority`.

Projects are also pre-sorted: **Inbox first**, then named projects alphabetically.

**Do not sort tasks or projects on the client.** Render the array in the order returned by the API. Re-sorting client-side will break the canonical order defined by the service.

## Column color accent

Each column renders a 3px top bar using `project.color` (hex string from the API). Inbox receives `#8A8782` (gray) from the API — no hardcoded client-side color for Inbox.

```tsx
<div
  className="h-[3px] w-full flex-shrink-0"
  style={{ background: project.color }}
  aria-hidden
/>
```

Color origin: `GetTodayTasksService` sets `color` on each `TodayProjectOutput`, sourced from DynamoDB `project.color` (or the Inbox constant). Propagates through `TodayProjectDto` in `@repo/contracts/tasks/today`.

## Priority stripe utility

Task cards show a left stripe based on **priority**, not project. Use `getPriorityStripeColor` from `@/utils/priority`:

```ts
import { getPriorityStripeColor } from "@/utils/priority";

const stripeColor = getPriorityStripeColor(task.priority);
// null when priority is null — no stripe rendered
```

Mapping:
- `"high"` → `bg-red-500`
- `"medium"` → `bg-amber-500`
- `"low"` → `bg-primary/70`
- `null` → `null` (stripe not rendered)

File: `apps/spa/src/app/utils/priority.ts`

## Key files

- `view/components/project-column/project-column.tsx` — column + task card rendering
- `view/components/project-column-header/` — column header (name, actions)
- `app/hooks/use-get-today-tasks.ts` — React Query hook for the Today kanban (previously `modules/todo/app/hooks/`)
- `app/services/get-today-tasks.ts` — HTTP GET `/tasks/today` (previously `modules/todo/app/services/`)

