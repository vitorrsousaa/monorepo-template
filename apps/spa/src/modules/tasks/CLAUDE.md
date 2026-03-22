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
