# @repo/contracts — Claude Context

Shared types and DTOs between API and SPA. Single source of truth for request/response and wire formats.

## Role

- **API** and **SPA** both import from `@repo/contracts/...`.
- Do **not** duplicate DTO or route types in either app. Adding a new endpoint or field should start here (or in the right contract module).

## Structure

Organized by domain with clear separation of concerns:

- **`src/common/`** — shared helpers (e.g. `PaginatedResponse<T>`).
- **`src/auth/`** — User entity and routes (signin, signup, profile).
  - `entities/` — shared `User` entity
  - `signin/`, `signup/`, `profile/` — per-route input/output types
- **`src/tasks/`** — Task entity and routes (create, inbox, today).
  - `entities/` — shared `Task`/`TaskDto` entity
  - `create/` — `schema.ts` (Zod + constants), `output.ts` (response type)
  - `inbox/`, `today/` — output-only routes (no body)
- **`src/projects/`** — Project entity and routes (get-all).
  - `entities/` — shared `ProjectDto` entity
  - `get-all/` — response type
- **`src/todo/`** — todo (legacy, do not create new todo symbols).

Each route folder has an `index.ts` barrel that exports request/response interfaces and re-exports shared entities.

## Import rule

**Always** import from `@repo/contracts/<domain>/<path>`. Examples:

```ts
// Entities (shared domain models)
import type { TaskDto } from "@repo/contracts/tasks/entities";
import type { ProjectDto } from "@repo/contracts/projects/entities";
import type { User } from "@repo/contracts/auth/entities";

// Route-specific inputs/outputs
import type { CreateTaskInput, CreateTaskOutput } from "@repo/contracts/tasks/create";
import type { GetTodayTasksResponse } from "@repo/contracts/tasks/today";
import type { GetInboxTasksResponse } from "@repo/contracts/tasks/inbox";
import type { GetAllProjectsByUserResponse } from "@repo/contracts/projects/get-all";
import type { ProfileResponse } from "@repo/contracts/auth/profile";

// Validation constants (from schema.ts files)
import { TASK_TITLE_MAX, TASK_PRIORITIES } from "@repo/contracts/tasks/create";

// Legacy
import type { TodoDto } from "@repo/contracts/todo/dto";
import type { PaginatedResponse } from "@repo/contracts/common";
```

Package exports (see `package.json`) are subpath-based: `@repo/contracts/*` maps to `dist/*/index.js` and types.

## Main entry points

### Entities (shared domain models)
| Import | Content |
|--------|---------|
| `@repo/contracts/tasks/entities` | `Task`, `TaskDto` |
| `@repo/contracts/projects/entities` | `ProjectDto` |
| `@repo/contracts/auth/entities` | `User` |

### Task routes
| Import | Content |
|--------|---------|
| `@repo/contracts/tasks/create` | `CreateTaskInputDto` (from schema), `CreateTaskResponse`, validation constants |
| `@repo/contracts/tasks/inbox` | `GetInboxTasksResponse`, `TaskDto` |
| `@repo/contracts/tasks/today` | `TodayProjectDto`, `GetTodayTasksResponse`, `TaskDto` |

### Project routes
| Import | Content |
|--------|---------|
| `@repo/contracts/projects/get-all` | `GetAllProjectsByUserResponse`, `ProjectDto` |

### Auth routes
| Import | Content |
|--------|---------|
| `@repo/contracts/auth/signin` | `SigninInput`, `SigninResponse` |
| `@repo/contracts/auth/signup` | `SignupInput`, `SignupResponse` |
| `@repo/contracts/auth/profile` | `ProfileResponse`, `User` |

### Shared
| Import | Content |
|--------|---------|
| `@repo/contracts/common` | `PaginatedResponse<T>` |
| `@repo/contracts/todo/inbox` | `GetInboxTodosResponse`, `TodoDto` (legacy) |

When adding a new API route, add or extend the corresponding folder under `src/` and export from its `index.ts` so both API and SPA can import from `@repo/contracts/...`.

## File organization by route type

### POST/PUT/PATCH routes (with body)
Routes with a request body have **three files**:

```
<domain>/<route>/
  schema.ts    — Zod schema + validation constants + input type (inferred from schema)
  output.ts    — response type
  index.ts     — barrel exporting both
```

**Example:** `src/tasks/create/`
```ts
// schema.ts
export const TASK_TITLE_MAX = 100;
export const createTaskSchema = z.object({ title: z.string().max(TASK_TITLE_MAX), ... });

// input.ts
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// output.ts
export interface CreateTaskOutput { task: Task; }

// index.ts
export { createTaskSchema, TASK_TITLE_MAX } from "./schema";
export type { CreateTaskInput } from "./input";
export type { CreateTaskOutput } from "./output";
```

### GET/DELETE routes (no body)
Routes without a request body have **one file**:

```
<domain>/<route>/
  output.ts    — response type
  index.ts     — barrel exporting response and re-exporting shared entities
```

## Validation constants pattern

Contracts exports **validation constants** alongside Zod schemas. These constants are the single source of truth for min/max/enum values used by both API and SPA:

```ts
// contracts/tasks/create/schema.ts
export const TASK_TITLE_MIN = 1;
export const TASK_TITLE_MAX = 100;
export const TASK_DESCRIPTION_MAX = 500;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
```

When adding a new action schema, always extract numeric limits and enum values as named constants and export them. See [docs/schema-pattern.md](../../docs/schema-pattern.md).

## References

- Root [CLAUDE.md](../../CLAUDE.md) — project identity, Task vs Todo, “always use @repo/contracts”.
- Optional: [docs/contracts-package.md](../../docs/contracts-package.md) for more detail (Portuguese).
