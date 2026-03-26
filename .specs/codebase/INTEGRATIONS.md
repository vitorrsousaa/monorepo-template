# External Integrations

## Cloud Infrastructure (AWS)

**Provider:** AWS
**Deployment:** Serverless Framework 4.31.0
**Region:** Configured per stage in `serverless.yml`

All infrastructure is defined as CloudFormation resources in `apps/api/serverless/resources/`.

---

## Authentication

**Service:** AWS Cognito User Pool
**Purpose:** User registration, authentication, JWT token issuance
**Implementation:** `apps/api/src/infra/auth/cognito/`
**Configuration:** `apps/api/serverless/resources/UserPool.yml`

**Auth flow:**
```
Client → Cognito (sign-in/sign-up) → JWT token
JWT token → API Gateway Cognito Authorizer → Lambda (sub extracted as userId)
```

**Key details:**
- `userId` = `sub` claim from JWT
- Extracted in: `apps/api/src/server/adapters/request-adapter.ts`
  ```typescript
  const userId = event.requestContext.authorizer?.jwt?.claims?.sub;
  ```
- Routes with `CognitoAuthorizer` in `serverless.yml` require valid JWT
- Pre-signup Lambda trigger: `apps/api/src/server/triggers/` (for custom registration logic)
- SDK: `@aws-sdk/client-cognito-identity-provider` 3.1009.0

**API endpoints (public):**
- `POST /auth/signin`
- `POST /auth/signup`
- `GET /auth/account` (authenticated)

---

## Database

**Service:** AWS DynamoDB
**Purpose:** Single-table storage for all domain entities
**Implementation:** `apps/api/src/infra/db/dynamodb/`
**Configuration:** `apps/api/serverless/resources/Database.yml`

**Single-table design:**
- Table name: `DYNAMODB_TABLE_NAME` (env var, configured per stage)
- `PK = USER#<userId>`, `SK = <ENTITY>#<id>`
- Indexes:
  - GSI1 (`DueDateIndex`): tasks by due date — used for overdue + today queries
  - GSI3: sections by project
  - GSI6: projects by name
- Full schema: `docs/database-design.md`
- Access patterns: `docs/access-patterns.md`

**SDK:** `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb` 3.1009.0

**DynamoDB client wrapper:** `apps/api/src/infra/db/dynamodb/client/`
- `IDatabaseClient` interface: `apps/api/src/infra/db/dynamodb/contracts/`
- Used by all repositories — never call DynamoDB SDK directly from repos

**IAM:** Lambda functions have DynamoDB CRUD permissions declared in `serverless.yml`

**IMPORTANT:** Before using a GSI in new code, verify it exists in `Database.yml` (CloudFormation). GSI activation requires a check — see memory `feedback_gsi_index_check.md`.

---

## API Gateway

**Service:** AWS API Gateway (HTTP API)
**Purpose:** HTTP routing to Lambda functions
**Configuration:** Defined per-function in `serverless.yml`

**Route conventions:**
```yaml
# serverless.yml function definition
getTodayTasks:
  handler: src/server/functions/tasks/get-today-tasks.handler
  events:
    - httpApi:
        path: /tasks/today
        method: GET
        authorizer:
          name: CognitoAuthorizer  # requires JWT
```

**CORS:** Configured globally in `serverless.yml`

---

## Lambda Functions

**Runtime:** Node.js 22.x
**Handler convention:** each file exports a `handler` function
**Location:** `apps/api/src/server/functions/<domain>/<action>.ts`

All handlers follow the same pattern:
```typescript
// apps/api/src/server/functions/tasks/get-today-tasks.ts
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";
import { makeGetTodayTasksController } from "@factories/controllers/tasks/get-today-tasks";

export const handler = lambdaHttpAdapter(makeGetTodayTasksController());
```

**Note:** All handler file paths must be listed in `knip.config.ts` entry points, or Knip will flag them as unused.

---

## SPA HTTP Client

**Library:** Axios 1.13.2
**Location:** `apps/spa/src/app/services/http-client.ts`
**Purpose:** Makes authenticated API requests from the SPA

**Features:**
- Attaches JWT Bearer token from localStorage on every request
- Base URL from environment config (`VITE_API_URL`)
- Request/response interceptors for auth and error handling

---

## Environment Variables

**API:**
- `DYNAMODB_TABLE_NAME` — DynamoDB table name (stage-specific)
- Loaded via `serverless-dotenv-plugin` (`.env` files per stage)

**SPA:**
- `VITE_API_URL` — API Gateway base URL
- `VITE_COGNITO_*` — Cognito pool/client IDs for auth

---

## No Webhooks or Background Jobs

- No webhook handlers currently implemented
- No background job queue (SQS/SNS/EventBridge not configured)
- Cognito pre-signup trigger is the only async event handler
