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

See **`src/app/modules/claude.md`** for the single source of truth on what goes in each subfolder (`controllers/`, `services/`, `mappers/`, `errors/`) and the one-folder-per-feature convention.

**Index exports (required):** Every controller feature folder must have `index.ts` exporting both controller and schema. Every service feature folder must have `index.ts` exporting both service and dto. See `.cursor/rules/api-patterns.mdc` for the exact pattern.

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

**Private controller (recommended for most endpoints):** Use `Controller<'private', ResponseType>` and `Controller.Request<'private'>` so `request.userId` is typed as `string` (no `?? ""` needed).

```ts
import { Controller } from "@application/interfaces/controller";
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
```ts
export class XService implements IXService {
  constructor(private readonly repo: IXRepository) {}

  async execute(data: XInput): Promise<XOutput> {
    // business logic
  }
}
```

## Error Handling

- `AppError` for domain errors: `throw new AppError("message", statusCode)`
- Errors are handled in the **lambda adapter** (try/catch around `controller.execute(request)` + `errorHandler`). Controllers do not use try/catch or call `errorHandler`.
- `missingFields` (used by base `Controller.validateBody`) validates via Zod schema and **throws** `ZodError` on failure; the adapter turns it into a formatted response.

## Auth State — Cognito JWT

- `requestAdapter` extracts `userId` (sub claim) do JWT do Cognito via `event.requestContext.authorizer.jwt.claims.sub`
- Rotas com `CognitoAuthorizer` no `serverless.yml` requerem JWT válido
- `MOCK_USER_ID` foi descontinuado; remover quando encontrado em mocks antigos

## DynamoDB State

Repositórios implementam acesso ao DynamoDB via `IDatabaseClient`. Verificar configuração de ambiente para connection string.

- Mock IDs (legado): `src/infra/db/dynamodb/repositories/mock-ids.ts`
- DB schema reference: `docs/database-design.md` (single-table, PK/SK pattern)
- Remover arquivos `*-repository.mocks.ts` quando não mais necessários

## Testing

| Command | Description |
|---------|-------------|
| `pnpm --filter api test:unit` | Unit tests (co-located `*.test.ts`) |
| `pnpm --filter api test:integration` | Integration tests (`*.integration.test.ts`) |
| `pnpm --filter api test:watch` | Watch mode |
| `pnpm --filter api test:integration:up` | Start DynamoDB Local (Docker) |
| `pnpm --filter api test:integration:down` | Stop DynamoDB Local |

**Conventions:**
- Unit tests are co-located with source files (e.g., `service.test.ts` next to `service.ts`)
- Services are tested with mocked repositories; controllers with mocked services
- Builders and mocks live in `src/test/` — import from `@test/builders` and `@test/mocks`
- Integration tests use DynamoDB Local via Docker (`docker-compose.test.yml`)

See [`src/test/CLAUDE.md`](src/test/CLAUDE.md) for full testing patterns and examples.

## Local Dev

```bash
pnpm dev:api          # Start API on port 4000
```

## Deploy

```bash
pnpm run deploy:dev                              # full stack → dev
pnpm run deploy:prod                             # full stack → prod
pnpm run deploy:fn -- <functionName> <stage>     # single function
pnpm run deploy:fn:dev -- --function <name>      # single function shortcut (dev)
pnpm run deploy:fn:prod -- --function <name>     # single function shortcut (prod)
```

## Related documentation

- [src/app/modules/claude.md](src/app/modules/claude.md) — module structure conventions (controllers, services, mappers, errors)
- [src/infra/CLAUDE.md](src/infra/CLAUDE.md) — infrastructure layer overview (DynamoDB + Cognito)
- [src/infra/db/dynamodb/mappers/CLAUDE.md](src/infra/db/dynamodb/mappers/CLAUDE.md) — DynamoDB mapper conventions
- [src/infra/db/dynamodb/repositories/CLAUDE.md](src/infra/db/dynamodb/repositories/CLAUDE.md) — DynamoDB repository conventions
- [src/infra/db/dynamodb/factories/CLAUDE.md](src/infra/db/dynamodb/factories/CLAUDE.md) — repository factory conventions
- [src/test/CLAUDE.md](src/test/CLAUDE.md) — test utilities (builders, mocks, integration setup)
