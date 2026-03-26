# Architecture

**Pattern:** Monorepo — Serverless backend (Clean Architecture) + React SPA (Feature-Sliced partial) + Shared contracts layer

## High-Level Structure

```
┌─────────────────────────────────────────────────────┐
│                   @repo/contracts                    │
│         (source of truth: DTOs + Zod schemas)       │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
    ┌──────────▼──────────┐  ┌────────▼──────────┐
    │      apps/api        │  │     apps/spa       │
    │  AWS Lambda + DDB    │  │  React + Vite      │
    │  Clean Architecture  │  │  TanStack Query    │
    └─────────────────────┘  └────────────────────┘
```

## API: Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│  server/ (Lambda handlers + adapters)        │
│  factories/ (DI wiring, makeXxx factories)   │
├─────────────────────────────────────────────┤
│  app/modules/ (controllers + services)       │
│  infra/ (DynamoDB repos + Cognito auth)      │
├─────────────────────────────────────────────┤
│  data/ (repository interfaces I*Repository)  │
├─────────────────────────────────────────────┤
│  core/domain/ (pure entities: Task, Project) │
└─────────────────────────────────────────────┘
```

**Dependency rule:** outer layers depend on inner, never reversed.

## API: Request Flow

```
APIGatewayEvent
  → lambdaHttpAdapter(controller)
    → requestAdapter(event)          // extracts userId from JWT sub claim
    → controller.execute(request)
      → controller.handle(request)   // protected method, override in subclass
        → service.execute(data)
          → repository.method(...)
        ← domain result
      ← { statusCode, body }
    ← responseAdapter(response)     // wraps in APIGatewayProxyResult
```

**Key files:**
- `apps/api/src/server/adapters/request-adapter.ts` — extracts `userId` from `event.requestContext.authorizer.jwt.claims.sub`
- `apps/api/src/server/adapters/lambda-http-adapter.ts` — wraps controller, handles errors
- `apps/api/src/app/interfaces/controller.ts` — base `Controller<"private" | "public", TResponse>`

## API: Identified Patterns

### Factory Pattern (Dependency Injection)

**Location:** `apps/api/src/factories/`
**Purpose:** Wire dependencies without a DI container.
**Example:**
```typescript
// apps/api/src/factories/services/tasks/get-today-tasks.ts
export function makeGetTodayTasksService() {
  const taskRepo = makeTasksDynamoRepository();
  const projectRepo = makeProjectsDynamoRepository();
  return new GetTodayTasksService(taskRepo, projectRepo);
}
```

### Clean Architecture Module Structure

**Location:** `apps/api/src/app/modules/<feature>/`
**Structure per feature:**
```
controllers/
  <action>/
    controller.ts      // extends Controller, implements handle()
    schema.ts          // Zod schema (from @repo/contracts)
    index.ts           // re-exports
services/
  <action>/
    service.ts         // implements IXxxService, contains business logic
    dto.ts             // service input/output types (pure TS, no Zod)
    service.test.ts    // unit tests co-located
mappers/               // domain DTO → response DTO (optional per module)
errors/                // domain-specific errors
```

### Repository + Mapper Pattern (DynamoDB)

**Location:** `apps/api/src/infra/db/dynamodb/`
**Purpose:** Decouple domain from DynamoDB PK/SK/GSI logic.
```
repositories/
  <entity>/
    <entity>-dynamo-repository.ts   // implements I<Entity>Repository
mappers/
  <entity>/
    <entity>-mapper.ts             // toDomain() + toDynamo()
    types.ts                       // DynamoDB entity shape (PK, SK, GSI1SK, etc.)
```
**Key rule:** PK/SK/GSI logic lives in mappers, not repositories.

### DynamoDB Single-Table Design

- `PK = USER#<userId>`, `SK = <ENTITY>#<id>`
- GSI1 (DueDateIndex): tasks by due date — for overdue + today queries
- GSI3: sections by project
- GSI6: projects by name
- All entities stored in one table (configurable via `DYNAMODB_TABLE_NAME` env var)

## SPA: Feature-Sliced Structure (partial)

```
src/
├── app/           // cross-cutting: config, services, hooks, libs, contexts
└── modules/
    └── <feature>/
        ├── app/
        │   ├── services/     // API call functions (Axios, typed by @repo/contracts)
        │   ├── hooks/        // TanStack Query hooks (useGetX, useCreateX, etc.)
        │   ├── mappers/      // form data → API input conversion
        │   └── cache/        // cache helper factories (setQueryData wrappers)
        └── view/
            ├── forms/        // React Hook Form forms
            ├── components/   // feature-specific components
            ├── modals/       // modal dialogs
            └── index.ts      // re-exports
```

## SPA: TanStack Query Strategy

**Intentional design — do not change:**
```typescript
// apps/spa/src/app/libs/query.tsx
defaultOptions: {
  queries: {
    staleTime: Number.POSITIVE_INFINITY,   // data never auto-stales
    refetchOnMount: false,                  // no re-fetch on remount
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  }
}
```
Fetch once on first mount, invalidate explicitly via `queryClient.invalidateQueries()`.

## SPA: Cache Helper Pattern

Never call `queryClient.setQueryData` directly in hooks. Always use cache helper factories:
```typescript
// apps/spa/src/modules/tasks/app/cache/tasks-inbox.cache.ts
export function makeTasksInboxCache(queryClient: QueryClient) {
  return {
    add: (task: Task) => queryClient.setQueryData(QUERY_KEYS.TASKS.INBOX, ...),
    remove: (taskId: string) => queryClient.setQueryData(...),
    update: (task: Task) => queryClient.setQueryData(...),
  };
}
```

## Schema Pattern (Contracts → API → SPA)

```
packages/contracts/src/<entity>/<action>/schema.ts
  → Zod schema + validation constants (TASK_TITLE_MAX, etc.)

apps/api/src/app/modules/<entity>/services/<action>/dto.ts
  → Pure TS interface (extends contracts type + userId) — no Zod

apps/spa/src/modules/<entity>/app/services/<action>.ts
  → Uses contracts output types

apps/spa/src/modules/<entity>/view/forms/<form>.tsx
  → Imports constants from contracts for min/max sync
```

## Data Flow: Create Task (end-to-end)

```
SPA Form (React Hook Form + Zod from @repo/contracts)
  → mapTaskFormToCreateInput()           // form → API input mapper
  → httpClient.post("/tasks", input)     // Axios with JWT
  → API Gateway → Cognito Authorizer
  → Lambda handler (functions/tasks/create-task.ts)
  → lambdaHttpAdapter → requestAdapter (extracts userId)
  → CreateTaskController.handle()
  → CreateTaskService.execute({ userId, ...input })
  → TasksDynamoRepository.create(task)
  → TaskDynamoMapper.toDynamo(task)      // builds PK/SK
  → DynamoDB PutItem
  ← TaskDto
  ← SPA cache updated via cache helper
```
