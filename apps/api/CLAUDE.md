# API — Claude Context

Stack: AWS Lambda + Serverless Framework + TypeScript. Clean Architecture. Runs locally via `serverless-offline` on **port 4000**.

## Request Flow

Every Lambda handler follows this exact pipeline (handlers use `lambdaHttpAdapter(controller)` which wraps the steps below):

```
APIGatewayEvent
  → handler = lambdaHttpAdapter(controller) (src/server/functions/<domain>/<feature>/handler.ts)
  → requestAdapter (src/server/adapters/request.ts)
  → makeXController() factory (src/factories/controllers/<domain>/<feature>.ts)
      → makeXService() factory (src/factories/services/<domain>/<feature>.ts)
          → repository factory (src/infra/db/dynamodb/factories/<entity>-repository-factory.ts)
  → controller.handle(request) (src/app/modules/<domain>/controllers/<feature>/controller.ts)
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
```ts
export class XController implements IController {
  constructor(private readonly service: IXService) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const [ok, parsed] = missingFields(schema, { ...request.body, userId: request.userId || "" });
      if (!ok) return parsed;
      const result = await this.service.execute(parsed);
      return { statusCode: 200, body: result };
    } catch (error) {
      return errorHandler(error);
    }
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
- `errorHandler` in controllers catches and formats all errors
- `missingFields` validates request shape via Zod schema — returns `[false, errorResponse]` on failure

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
