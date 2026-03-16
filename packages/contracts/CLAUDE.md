# @repo/contracts — Claude Context

Shared types and DTOs between API and SPA. Single source of truth for request/response and wire formats.

## Role

- **API** and **SPA** both import from `@repo/contracts/...`.
- Do **not** duplicate DTO or route types in either app. Adding a new endpoint or field should start here (or in the right contract module).

## Structure

Organized by domain and route:

- `src/todo/` — todo (legacy) DTOs and per-route types: inbox, create, dto.
- `src/tasks/` — task DTOs and per-route types: today, dashboard, dto.
- `src/common/` — shared helpers (e.g. `PaginatedResponse<T>`).

Each route or concept has an `index.ts` that exports request/response interfaces and re-exports DTOs where needed.

## Import rule

**Always** import from `@repo/contracts/<path>`. Examples:

```ts
import type { TodoDto, GetInboxTodosResponse } from "@repo/contracts/todo/inbox";
import type { TaskDto, GetTodayTasksResponse } from "@repo/contracts/tasks/today";
import type { CreateTodoRequest, CreateTodoResponse } from "@repo/contracts/todo/create";
import type { TodoDto } from "@repo/contracts/todo/dto";
import type { TaskDto } from "@repo/contracts/tasks/dto";
import type { PaginatedResponse } from "@repo/contracts/common";
```

Package exports (see `package.json`) are subpath-based: `@repo/contracts/*` maps to `dist/*/index.js` and types.

## Main entry points

| Import | Content |
|--------|---------|
| `@repo/contracts/todo/inbox` | `GetInboxTodosRequest`, `GetInboxTodosResponse`, `TodoDto` |
| `@repo/contracts/todo/create` | `CreateTodoRequest`, `CreateTodoResponse`, `TodoDto` |
| `@repo/contracts/todo/dto` | `TodoDto` (if exported) |
| `@repo/contracts/tasks/today` | `TaskDto`, `TodayProjectDto`, `GetTodayTasksResponse` |
| `@repo/contracts/tasks/dto` | `TaskDto` |
| `@repo/contracts/common` | `PaginatedResponse<T>` |

When adding a new API route, add or extend the corresponding folder under `src/` and export from its `index.ts` so both API and SPA can import from `@repo/contracts/...`.

## Validation constants pattern

Contracts exports **validation constants** alongside Zod schemas. These constants are the single source of truth for min/max/enum values used by both API and SPA:

```ts
// contracts/tasks/create/index.ts
export const TASK_TITLE_MIN = 1;
export const TASK_TITLE_MAX = 100;
export const TASK_DESCRIPTION_MAX = 500;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
```

When adding a new action schema, always extract numeric limits and enum values as named constants and export them. See [docs/schema-pattern.md](../../docs/schema-pattern.md).

## References

- Root [CLAUDE.md](../../CLAUDE.md) — project identity, Task vs Todo, “always use @repo/contracts”.
- Optional: [docs/contracts-package.md](../../docs/contracts-package.md) for more detail (Portuguese).
