# Code Conventions

## Naming Conventions

**Files:** `kebab-case.ts` / `kebab-case.tsx`
Examples: `get-today-tasks.ts`, `task-mapper.ts`, `tasks-dynamo-repository.ts`, `task-to-dto.ts`

**Interfaces:** `I` prefix
Examples: `IController`, `IService`, `ITasksRepository`, `IDatabaseClient`, `IGetTodayTasksService`

**Classes:** PascalCase
Examples: `GetTodayTasksService`, `TasksDynamoRepository`, `TaskDynamoMapper`, `GetTodayTasksController`

**Factory functions:** `make` prefix
Examples: `makeGetTodayTasksService()`, `makeGetTodayTasksController()`, `makeTasksDynamoRepository()`

**Builder functions (test):** `build` prefix
Examples: `buildTask()`, `buildProject()`, `buildPrivateRequest()`, `buildTaskDynamoEntity()`

**Mock factories (test):** `mock` prefix
Examples: `mockTasksRepository()`, `mockProjectsRepository()`, `mockDatabaseClient()`

**React hooks:** `use` prefix (standard)
Examples: `useGetInboxTasks()`, `useCreateTask()`, `useGetTodayTasks()`

**Cache helpers:** `make<Feature>Cache` or `make<Feature><Type>Cache`
Examples: `makeTasksInboxCache(queryClient)`, `makeProjectsAllCache(queryClient)`

**Constants (validation):** SCREAMING_SNAKE_CASE from contracts
Examples: `TASK_TITLE_MAX`, `TASK_TITLE_MIN`, `PROJECT_NAME_MAX`

## File Organization

**Index files required** — every folder that exports must have `index.ts` re-exporting:
```typescript
// apps/api/src/app/modules/tasks/controllers/get-today-tasks/index.ts
export { GetTodayTasksController } from "./controller";
```

**Co-location** — tests live next to the code they test:
```
services/get-today-tasks/
  service.ts
  service.test.ts    ← co-located unit test
  dto.ts
```

**Module folder = one action/feature:**
```
controllers/
  get-today-tasks/   ← one folder per controller
    controller.ts
    schema.ts
    index.ts
```

## Import Style

**Path aliases (API):**
- `@modules/*` → `src/app/modules/*`
- `@core/*` → `src/core/*`
- `@data/*` → `src/data/*`
- `@infra/*` → `src/infra/*`
- `@factories/*` → `src/factories/*`
- `@server/*` → `src/server/*`
- `@test/*` → `src/test/*`

**Path aliases (SPA):**
- `@/pages/*` → `src/view/pages/*`
- `@/components/*` → `src/view/components/*`
- `@/modules/*` → `src/modules/*`
- `@/services/*` → `src/app/services/*`
- `@/hooks/*` → `src/app/hooks/*`
- `@/config/*` → `src/app/config/*`

**Shared types:** Always import from `@repo/contracts/<domain>/<path>`:
```typescript
import type { TaskDto } from "@repo/contracts/tasks/entities";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import { TASK_TITLE_MAX } from "@repo/contracts/tasks/create";
```

**Never duplicate DTOs** — if a type is shared between API and SPA, it belongs in `@repo/contracts`.

## Type Safety

**TypeScript strict mode** — all workspace packages use `strict: true` via `@repo/typescript-config`.

**No Zod in services/repositories** — Zod validation happens at controller boundary (schema.ts) and in SPA forms. Services and repositories use pure TS interfaces.

**`type` keyword for imports** — prefer `import type` for type-only imports:
```typescript
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
```

## Error Handling

**Custom error classes** per domain — extend base error:
```typescript
// apps/api/src/app/modules/tasks/errors/
export class TaskNotFoundError extends Error { ... }
```

**Controller catches and maps errors** — the base `Controller` class wraps `handle()` in try/catch and maps domain errors to HTTP responses via `lambdaHttpAdapter`.

## Code Style (Biome)

- Formatter: Biome (not Prettier) — single quotes, 2-space indent, trailing commas
- No `for...of` on arrays when Biome `noForEach` complains — use `map`/`filter`/`reduce`
- No non-null assertions (`!`) — Biome warns; handle optionals explicitly
- Organize imports: automatically sorted by Biome

## Entity Naming: Task vs Todo

**CANONICAL: `Task`** — use for all new code
**LEGACY: `Todo`** — still in codebase; do not rename, do not create new `Todo` symbols

```typescript
// ✅ correct — new code uses Task
const task: Task = { id: "...", title: "...", ... };

// ❌ wrong — do not create new Todo symbols
const todo: Todo = { ... };
```

## Controller Pattern

Controllers extend the base `Controller` class:
```typescript
export class GetTodayTasksController extends Controller<"private", GetTodayTasksResponse> {
  constructor(private readonly service: IGetTodayTasksService) {
    super();
  }

  protected override async handle(
    request: Controller.Request<"private">,
  ): Promise<Controller.Response<GetTodayTasksResponse>> {
    const result = await this.service.execute({ userId: request.userId });
    return { statusCode: 200, body: { projects: result.projects.map(todayProjectToDto) } };
  }
}
```
- `"private"` controllers receive `userId` extracted from JWT
- `"public"` controllers do not require authentication

## Mapper Pattern

Mappers are pure transformation functions — no side effects, no async:
```typescript
// API response mapper
export function todayProjectToDto(project: TodayProjectOutput): TodayProjectDto { ... }

// DynamoDB mapper — toDomain() + toDynamo()
export class TaskDynamoMapper {
  static toDomain(entity: TaskDynamoDBEntity): Task { ... }
  static toDynamo(task: Task, userId: string): TaskDynamoDBEntity { ... }
}
```

## SPA Form Mapper Pattern

**Location:** `modules/<feature>/app/mappers/<feature>-mappers.ts`
**Naming:** `map<FormName>To<ApiName>`
```typescript
export function mapTaskFormToCreateInput(form: TaskFormValues): CreateTaskInput {
  return {
    title: form.title,
    projectId: form.project === "none" ? null : form.project,  // "none" → null
    dueDate: form.dueDate?.toISOString() ?? null,              // Date → ISO string
  };
}
```
