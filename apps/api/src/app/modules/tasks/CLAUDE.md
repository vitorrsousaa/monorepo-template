# tasks module (API)

Business rules and service conventions for the **tasks** domain.

## `get-today-tasks` — ordering rules

Tasks are grouped by project, then ordered within each group by priority. This is the **canonical sort order** — the SPA must not re-sort; it consumes the response as-is.

### Project ordering

1. **Inbox** (tasks with `projectId == null`) — always first, with hardcoded color `#8A8782`.
2. **Named projects** — sorted alphabetically (`localeCompare`) after Inbox.

Constants (service-local):
```ts
const INBOX_PROJECT_ID = "inbox";
const INBOX_PROJECT_NAME = "Inbox";
const INBOX_PROJECT_COLOR = "#8A8782";
```

### Task ordering within each project

Priority sort: `high → medium → low → null`.

```ts
const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
// null priority → 3 (last)
```

Implemented via `sortByPriority()` private method in `GetTodayTasksService`. Applied to both Inbox tasks and named-project tasks before the response is assembled.

### Response shape

`GetTodayTasksOutput.projects: TodayProjectOutput[]` — each entry has `id`, `name`, `color`, `tasks[]` (pre-sorted).

## Priority values

From `@repo/contracts/tasks/create` (`TASK_PRIORITIES`):

```ts
"high" | "medium" | "low" | null
```

`null` means no priority — always last in sort order.

## Related files

| Concern | File |
|---------|------|
| Service | `services/get-today-tasks/service.ts` |
| DTO | `services/get-today-tasks/dto.ts` |
| Contracts | `@repo/contracts/tasks/today` (`TodayProjectDto`) |
| SPA consumer | `apps/spa/src/modules/tasks/CLAUDE.md` |
