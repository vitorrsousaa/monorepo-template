# API — Claude Context

Stack: AWS Lambda + Serverless Framework + TypeScript. Clean Architecture. Runs locally via `serverless-offline` on **port 4000**.

## Request Flow

Every Lambda handler follows this exact pipeline (handlers use `lambdaHttpAdapter(controller)` which wraps the steps below). Errors are handled in the lambda adapter (try/catch + `errorHandler`); controllers do not use try/catch.

```
APIGatewayEvent
  → handler = lambdaHttpAdapter(controller) (src/server/functions/<domain>/<feature>/handler.ts)
  → requestAdapter(event, controller.controllerType) — sets userId from JWT/mock (private) or null (public)
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

From `serverless.yml`. All routes are **private** (require auth / `userId`); when auth is implemented, public routes will use `controllerType: "public"` and `userId` will be `null`.

| Path | Method | Purpose | Auth |
|------|--------|---------|------|
| `/todos` | GET | List todos (legacy) | private |
| `/todos/inbox` | GET | List inbox todos | private |
| `/todos` | POST | Create todo | private |
| `/tasks/today` | GET | Today tasks (grouped by project) | private |
| `/tasks/dashboard` | GET | Dashboard analytics | private |
| `/projects` | GET | List projects by user | private |
| `/projects` | POST | Create project | private |
| `/projects/{projectId}/detail` | GET | Project detail | private |
| `/projects/{projectId}/sections` | GET | List sections of project | private |
| `/projects/{projectId}/sections` | POST | Create section | private |

## Public vs private routes (controller type)

Controllers declare whether they are **public** or **private** so `request.userId` is correctly typed and the adapter injects the right value:

- **Private** (`Controller<'private', TBody>`): `request.userId` is `string` (from JWT or `MOCK_USER_ID`). Use for all endpoints that require the current user.
- **Public** (`Controller<'public', TBody>`): `request.userId` is `null`. Use for health, sign-in, or any unauthenticated endpoint.

**How it works:** The base class receives `controllerType` in the constructor. The lambda adapter calls `requestAdapter(event, controller.controllerType)` so that for `"public"` it sets `userId: null`; for `"private"` it sets `userId` from JWT or mock. In `handle()`, use `Controller.Request<'private'>` or `Controller.Request<'public'>` so TypeScript narrows `userId` to `string` or `null`.

## Adding a New Feature — Checklist

1. **Domain** (if new entity): `src/core/domain/<entity>/<entity>.ts`
2. **Repository protocol**: `src/data/protocols/<entity>/<entity>-repository.ts`
3. **Service + DTO**: `src/app/modules/<domain>/services/<feature>/service.ts` + `dto.ts`
4. **Controller + Schema**: `src/app/modules/<domain>/controllers/<feature>/controller.ts` + `schema.ts`
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

## Auth State — MOCK

```ts
// apps/api/src/app/config/mock-user.ts
export const MOCK_USER_ID = "93470f22-3bc0-4a98-90b2-306fb233e0f5" as const;
```

- `requestAdapter` injects `userId` from `MOCK_USER_ID` (not from JWT)
- **Do not implement real JWT auth unless explicitly asked**
- When real auth arrives: replace `requestAdapter`, remove `MOCK_USER_ID`

## DynamoDB State — IN-MEMORY MOCKS

All repositories use in-memory arrays from `*-repository.mocks.ts` files. DynamoDB client is commented out with `// TODO: Implement real DynamoDB`.

- Data **does not persist** between serverless-offline restarts
- **Do not implement real DynamoDB unless explicitly asked**
- Mock IDs live in `src/infra/db/dynamodb/repositories/mock-ids.ts`
- DB schema reference: `docs/database-design.md` (single-table, PK/SK pattern)

## Local Dev

```bash
pnpm dev:api          # nodemon + serverless offline, port 4000
pnpm dev:api:no-watch # serverless offline without nodemon
```

## Deploy

Full stack:

```bash
pnpm run deploy:dev   # stage dev
pnpm run deploy:prod  # stage prod
```

Single function (obrigatório passar nome da função e stage na ordem indicada):

```bash
# Forma: pnpm run deploy:fn -- <nomeDaFunção> <stage>
pnpm run deploy:fn -- getProjectDetail dev
pnpm run deploy:fn -- getTodayTasks prod
```

Atalhos por stage (a função ainda precisa ser passada após `--`):

```bash
pnpm run deploy:fn:dev  -- --function getProjectDetail
pnpm run deploy:fn:prod -- --function getTodayTasks
```
