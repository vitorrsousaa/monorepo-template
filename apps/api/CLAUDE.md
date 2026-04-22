# API — Claude Context

Stack: AWS Lambda + Serverless Framework + TypeScript. Clean Architecture. Runs on **port 4000**.

## Architecture Layers

```
Domain (core/domain/)          ← Pure entities, no dependencies
  ↑
Data (data/protocols/)         ← Interfaces: I*Repository, I*Mapper
  ↑                  ↑
App (app/modules/)   Infra (infra/)
  services,            db/dynamodb/ (repos, mappers, factories, client)
  controllers,         auth/cognito/ (auth provider)
  mappers, errors
  ↑                  ↑
Factories (factories/)         ← DI: wires infra → app → presentation
  ↑
Server (server/functions/)     ← Lambda handlers + HTTP adapters
```

Dependencies always point inward. Services depend on interfaces (`I*Repository`), never on implementations.

### Current modules

| Module | Domain | Controllers | Services | Has Mappers | Has Errors |
|--------|--------|-------------|----------|-------------|------------|
| `auth` | signup, signin, account-info | 3 | 3 | - | `user-not-found` |
| `projects` | CRUD, detail, summary | 4 | 4 | `project-to-dto` | `project-not-found` |
| `sections` | create, get-all-by-project | 2 | 2 | - | - |
| `settings` | get-user-settings | 1 | 1 | - | `settings-not-found` |
| `tasks` | create, inbox, today, dashboard, completion | 5 | 7 | `task-to-dto` | `task-not-found` |
| `todos` (legacy) | get-todos | 1 | 1 | `todo-to-dto` | - |

### Infra implementations

| Layer | Entities covered |
|-------|-----------------|
| DynamoDB repositories | todo, tasks, projects, sections, settings, user |
| DynamoDB mappers | todo, tasks, projects, sections, settings, user |
| Auth (Cognito) | signin, signup, auth-provider + presignup trigger |

## Request Flow

Every Lambda handler follows this exact pipeline (handlers use `lambdaHttpAdapter(controller)` which wraps the steps below). Errors are handled in the lambda adapter (try/catch + `errorHandler`); controllers do not use try/catch.

```
APIGatewayEvent
  → handler = lambdaHttpAdapter(controller) (src/server/functions/<domain>/<feature>/handler.ts)
  → requestAdapter(event) — builds IRequest; userId comes from JWT/mock when authorizer is present, else null (public/private is defined by the route in serverless.yml, not passed to the adapter)
  → makeXController() factory (src/factories/controllers/<domain>/<feature>.ts)
      → makeXService() factory (src/factories/services/<domain>/<feature>.ts)
          → repository factory (src/infra/db/dynamodb/factories/<entity>-repository-factory.ts)
  → controller.execute(request) → validateBody(request.body) → controller.handle(request)
  → service.execute(data) (src/app/modules/<domain>/services/<feature>/service.ts)
  → repository method (src/infra/db/dynamodb/repositories/<entity>/<entity>-dynamo-repository.ts)
  → responseAdapter (src/server/adapters/response.ts)
```

## Path Aliases

Source: `apps/api/tsconfig.paths.json`

| Alias | Resolves to |
|-------|------------|
| `@application/*` | `src/app/*` |
| `@server/*` | `src/server/*` |
| `@core/*` | `src/core/*` |
| `@factories/*` | `src/factories/*` |
| `@data/*` | `src/data/*` |
| `@infra/*` | `src/infra/*` |

## API Routes

From `serverless.yml`. Auth routes (signup, signin) are **public**; all others require Cognito JWT authorizer.

| Path | Method | Purpose | Auth |
|------|--------|---------|------|
| `/auth/signup` | POST | Register new user | public |
| `/auth/signin` | POST | Sign in | public |
| `/auth/account-info` | GET | Current user info | private |
| `/settings/user-settings` | GET | Get user settings | private |
| `/todos` | GET | List todos (legacy) | private |
| `/tasks/inbox` | GET | List inbox tasks | private |
| `/tasks/today` | GET | Today tasks (grouped by project) | private |
| `/tasks/dashboard` | GET | Dashboard analytics | private |
| `/tasks/create` | POST | Create task | private |
| `/tasks/{taskId}/completion` | PATCH | Toggle task completion | private |
| `/projects` | GET | List projects by user | private |
| `/projects` | POST | Create project | private |
| `/projects/summary` | GET | Projects summary | private |
| `/projects/{projectId}/detail` | GET | Project detail | private |
| `/projects/{projectId}/sections` | GET | List sections of project | private |
| `/projects/{projectId}/sections` | POST | Create section | private |

## Public vs private routes (controller type)

- **Private** (`Controller<'private', TBody>`): `request.userId` is `string` (from JWT). Most endpoints.
- **Public** (`Controller<'public', TBody>`): `request.userId` is `null`. Auth routes (signup, signin).

Route visibility is determined by serverless.yml (authorizer present or not). The lambda adapter calls `requestAdapter(event)` which sets `userId` from JWT claims when present, `null` otherwise. Controllers use `Controller.Request<'private'>` or `Controller.Request<'public'>` for correct TypeScript narrowing.

## Modules structure

See **`src/app/modules/claude.md`** for the single source of truth on subfolder conventions (`controllers/`, `services/`, `mappers/`, `errors/`), one-folder-per-feature, and required `index.ts` barrel exports.

## Adding a New Feature — Checklist

1. **Domain** (if new entity): `src/core/domain/<entity>/<entity>.ts`
2. **Repository protocol**: `src/data/protocols/<entity>/<entity>-repository.ts`
3. **Service + DTO**: `src/app/modules/<domain>/services/<feature>/service.ts` + `dto.ts`, and **`index.ts`** that exports `export * from "./dto"; export * from "./service";`
4. **Controller + Schema**: `src/app/modules/<domain>/controllers/<feature>/controller.ts` + `schema.ts`, and **`index.ts`** that exports `export * from "./controller"; export * from "./schema";`
5. **Factories**:
   - `src/factories/services/<domain>/<feature>.ts`
   - `src/factories/controllers/<domain>/<feature>.ts`
6. **Handler**: `src/server/functions/<domain>/<feature>/handler.ts` + `index.ts`
7. **serverless.yml**: register the function

## Code Patterns

### Handler
Handlers usam `lambdaHttpAdapter(controller)`; não chamar `requestAdapter`/`responseAdapter` manualmente.

```ts
import { makeXController } from "@factories/controllers/<domain>/<feature>";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeXController();
export const handler = lambdaHttpAdapter(controller);
```

### Factory (controller)
```ts
import { XController } from "@application/modules/<domain>/controllers/<feature>";
import { makeXService } from "@factories/services/<domain>/<feature>";

export function makeXController() {
  return new XController(makeXService());
}
```

### Controller
Controllers extend the base `Controller<TType, TBody>` class (do not `implements IController`). Pass `"private"` or `"public"` to `super()` so the request adapter sets `userId` correctly. Define `schema` (optional) and implement only `handle()`. No try/catch; errors are handled by the lambda adapter. Only `request.body` is validated; pass `userId` and `params` from `request` in `handle()` when the service needs them.

**CRITICAL — always depend on the service interface (`IXService`), never the concrete class.** Import from the barrel (`index.ts`), not from `service.ts` directly.

```ts
// ✅ correct — imports IXService from barrel, constructor typed as interface
import type { IGetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
//                                                                                                          ^^^^^^^^^^^ barrel index, not /service.ts

export class GetAllProjectsByUserController extends Controller<"private", GetAllProjectsByUserResponse> {
  constructor(private readonly service: IGetAllProjectsByUserService) { ... }
}
```

```ts
// ❌ wrong — imports the concrete class from service.ts; controller is tightly coupled to implementation
import type { GetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user/service";
//                                                                                                                  ^^^^^^^^ direct file import

export class GetAllProjectsByUserController extends Controller<"private", GetAllProjectsByUserResponse> {
  constructor(private readonly service: GetAllProjectsByUserService) { ... }
}
```

**Private controller (recommended for most endpoints):** Use `Controller<'private', ResponseType>` and `Controller.Request<'private'>` so `request.userId` is typed as `string` (no `?? ""` needed).

```ts
import { Controller } from "@application/interfaces/controller";
import type { IGetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
import type { GetAllProjectsByUserResponse } from "@repo/contracts/projects";

export class GetAllProjectsByUserController extends Controller<"private", GetAllProjectsByUserResponse> {
  constructor(private readonly service: IGetAllProjectsByUserService) {
    super("private");
  }

  protected override async handle(request: Controller.Request<"private">): Promise<Controller.Response<GetAllProjectsByUserResponse>> {
    const result = await this.service.execute({ userId: request.userId });
    return { statusCode: 200, body: { projects: result.projects.map(projectToDto) } };
  }
}
```

**Public controller:** Use `Controller<'public', TBody>` and `Controller.Request<'public'>`; `request.userId` will be `null`.

```ts
export class HealthController extends Controller<"public", HealthResponse> {
  constructor() {
    super("public");
  }
  protected override async handle(request: Controller.Request<"public">): Promise<Controller.Response<HealthResponse>> {
    return { statusCode: 200, body: { ok: true } };
  }
}
```

### Service

Every service MUST export an `IXService` interface. Controllers depend on the interface, never the concrete class. **Canonical example:** `src/app/modules/tasks/services/create/` (all 4 files).

**Required files per service folder:** `service.ts`, `dto.ts`, `index.ts`, `service.test.ts`

```ts
// ✅ correct — service.ts with interface export
import type { IService } from "@application/interfaces/service";

export interface IXService extends IService<XInput, XOutput> {}

export class XService implements IXService {
  constructor(private readonly repo: IXRepository) {}

  async execute(data: XInput): Promise<XOutput> {
    // business logic
  }
}
```

```ts
// ❌ wrong — no interface, controller depends on concrete class
export class XService {
  async execute(data: XInput): Promise<XOutput> { ... }
}
```

**DTO:** Input extends `@repo/contracts` type + `userId`; Output is a typed object. No Zod in services. Services sem retorno usam `undefined` como output type (nunca `void`). See `src/app/modules/CLAUDE.md` for full pattern with examples.

## Error Handling

All errors are handled in the **lambda adapter** (try/catch + `errorHandler`) — controllers do NOT use try/catch. `Controller.validateBody` throws `ZodError` on failure; adapter formats it.

### Domain errors — always extend AppError

Every error thrown inside a service **must be a named class that extends `AppError`**, defined in the module's `errors/` folder. Never throw a bare `Error` or an inline `new AppError(...)` from a service — the named class makes the error identifiable, reusable, and carries the correct HTTP status code.

```ts
// ✅ correct — named class in errors/, imported by the service
// src/app/modules/projects/errors/project-not-found.ts
import { AppError } from "@application/errors/app-error";

export class ProjectNotFound extends AppError {
  constructor() {
    super("Project not found", 404);
  }
}

// service.ts
import { ProjectNotFound } from "../../errors/project-not-found";

const project = await this.projectRepo.getById(projectId, ownerUserId);
if (!project) throw new ProjectNotFound(); // ← typed, 404, identifiable
```

```ts
// ❌ wrong — generic Error loses statusCode, lambda returns 500
if (!project) throw new Error("Project not found");

// ❌ wrong — inline AppError, not reusable, message/status scattered across service files
if (!project) throw new AppError("Project not found", 404);
```

If the module does not yet have an `errors/` folder, create it together with the first error file. See `src/app/modules/claude.md` for the full folder convention and examples.

## Auth State — Cognito JWT

`requestAdapter` extracts `userId` from JWT sub claim (`event.requestContext.authorizer.jwt.claims.sub`). Routes with `CognitoAuthorizer` in `serverless.yml` require valid JWT. `MOCK_USER_ID` is deprecated.

## DynamoDB State

Repos use `IDatabaseClient`. Schema: `docs/database-design.md` (single-table, PK/SK). Mock IDs (legacy): `src/infra/db/dynamodb/repositories/mock-ids.ts`. Remove `*-repository.mocks.ts` when no longer needed.

## Testing

| Command | Description |
|---------|-------------|
| `pnpm --filter api test:unit` | Unit tests (co-located `*.test.ts`) |
| `pnpm --filter api test:integration` | Integration tests (`*.integration.test.ts`) |
| `pnpm --filter api test:watch` | Watch mode |
| `pnpm --filter api test:integration:up` | Start DynamoDB Local (Docker) |
| `pnpm --filter api test:integration:down` | Stop DynamoDB Local |

**Conventions:** Co-located tests (`service.test.ts` next to `service.ts`). Services tested with mocked repos; controllers with mocked services. Builders/mocks: `@test/builders`, `@test/mocks`. Integration tests: DynamoDB Local via Docker. See [`src/test/CLAUDE.md`](src/test/CLAUDE.md).

## Local Dev & Deploy
```bash
pnpm run deploy:dev       # full stack → dev
pnpm run deploy:prod      # full stack → prod
pnpm run deploy:fn:dev -- --function <name>   # single function (dev)
pnpm run deploy:fn:prod -- --function <name>  # single function (prod)
```

## Related documentation

- [src/app/modules/claude.md](src/app/modules/claude.md) — module structure (controllers, services, mappers, errors)
- [src/infra/CLAUDE.md](src/infra/CLAUDE.md) — infrastructure layer (DynamoDB + Cognito)
- [src/infra/db/dynamodb/mappers/CLAUDE.md](src/infra/db/dynamodb/mappers/CLAUDE.md) — DynamoDB mappers
- [src/infra/db/dynamodb/repositories/CLAUDE.md](src/infra/db/dynamodb/repositories/CLAUDE.md) — DynamoDB repositories
- [src/infra/db/dynamodb/factories/CLAUDE.md](src/infra/db/dynamodb/factories/CLAUDE.md) — repository factories
- [src/test/CLAUDE.md](src/test/CLAUDE.md) — test utilities (builders, mocks, integration)
- [src/app/modules/tasks/CLAUDE.md](src/app/modules/tasks/CLAUDE.md) — task domain rules (priority, today grouping)
