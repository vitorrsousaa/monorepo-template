# API — Claude Context

Stack: AWS Lambda + Serverless Framework + TypeScript. Clean Architecture. Runs locally via `serverless-offline` on **port 4000**.

## Request Flow

Every Lambda handler follows this exact pipeline (handlers use `lambdaHttpAdapter(controller)` which wraps the steps below). Errors are handled in the lambda adapter (try/catch + `errorHandler`); controllers do not use try/catch.

```
APIGatewayEvent
  → handler = lambdaHttpAdapter(controller) (src/server/functions/<domain>/<feature>/handler.ts)
  → requestAdapter (src/server/adapters/request.ts)
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

From `serverless.yml`:

| Path | Method | Purpose |
|------|--------|---------|
| `/todos` | GET | List todos (legacy) |
| `/todos/inbox` | GET | List inbox todos |
| `/todos` | POST | Create todo |
| `/tasks/today` | GET | Today tasks (grouped by project) |
| `/tasks/dashboard` | GET | Dashboard analytics |
| `/projects` | GET | List projects by user |
| `/projects` | POST | Create project |
| `/projects/{projectId}/detail` | GET | Project detail |
| `/projects/{projectId}/sections` | GET | List sections of project |
| `/projects/{projectId}/sections` | POST | Create section |

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
Controllers extend the base `Controller` class (do not `implements IController`). Define `schema` (optional) and implement only `handle()`. No try/catch; errors are handled by the lambda adapter. Only `request.body` is validated; pass `userId` and `params` from `request` in `handle()` when the service needs them.

```ts
import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";

export class XController extends Controller {
  constructor(private readonly service: IXService) {
    super();
  }

  protected override schema = mySchema;

  protected override async handle(request: IRequest<MySchemaType>): Promise<IResponse> {
    const result = await this.service.execute({
      ...request.body,
      userId: request.userId ?? "",
    });
    return { statusCode: 200, body: result };
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
