# Project Structure

**Root:** `/Users/vitorsousa/Documents/dev/monorepo-template`

## Directory Tree

```
monorepo-template/
├── apps/
│   ├── api/                    — AWS Lambda backend (Clean Architecture)
│   │   ├── src/
│   │   │   ├── app/            — Application layer
│   │   │   │   ├── config/     — shared config
│   │   │   │   ├── errors/     — shared errors
│   │   │   │   ├── interfaces/ — IController, IService, IRequest, IResponse
│   │   │   │   ├── modules/    — domain modules (auth, projects, tasks, sections, settings, todos)
│   │   │   │   ├── providers/  — providers/factories
│   │   │   │   └── utils/      — utilities
│   │   │   ├── core/
│   │   │   │   └── domain/     — pure entities (task, todo, project, section)
│   │   │   ├── data/
│   │   │   │   └── protocols/  — repository interfaces (I*Repository)
│   │   │   ├── server/
│   │   │   │   ├── adapters/   — requestAdapter, responseAdapter, lambdaHttpAdapter, errorHandler
│   │   │   │   ├── functions/  — Lambda handlers by domain
│   │   │   │   └── triggers/   — Cognito pre-signup trigger
│   │   │   ├── factories/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   └── libs/
│   │   │   ├── infra/
│   │   │   │   ├── auth/cognito/     — Cognito auth provider
│   │   │   │   └── db/dynamodb/
│   │   │   │       ├── client/       — DynamoDB DocumentClient wrapper
│   │   │   │       ├── contracts/    — IDatabaseClient, BaseDynamoDBEntity
│   │   │   │       ├── mappers/      — domain ↔ DynamoDB (PK/SK/GSI logic)
│   │   │   │       ├── repositories/ — I*Repository implementations
│   │   │   │       └── factories/    — repository factories
│   │   │   └── test/
│   │   │       ├── builders/   — buildTask, buildProject, buildPrivateRequest
│   │   │       └── mocks/      — mockTasksRepository, mockProjectsRepository
│   │   ├── serverless.yml
│   │   ├── serverless/
│   │   │   └── resources/
│   │   │       ├── UserPool.yml    — Cognito CloudFormation
│   │   │       └── Database.yml    — DynamoDB CloudFormation
│   │   └── CLAUDE.md
│   ├── spa/                    — React + Vite SPA
│   │   ├── src/
│   │   │   ├── app/            — cross-cutting services & config
│   │   │   │   ├── config/     — routes.ts, query-keys.ts, storage.ts, environment.ts
│   │   │   │   ├── services/   — http-client (Axios), API call functions
│   │   │   │   ├── hooks/      — shared hooks
│   │   │   │   ├── contexts/   — React contexts
│   │   │   │   ├── libs/       — query.tsx (QueryClient), i18n
│   │   │   │   ├── storage/    — localStorage abstraction
│   │   │   │   ├── utils/      — pure utilities
│   │   │   │   └── entities/   — app-level types
│   │   │   ├── modules/        — feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── tasks/
│   │   │   │   ├── projects/
│   │   │   │   ├── sections/
│   │   │   │   ├── settings/
│   │   │   │   ├── goals/
│   │   │   │   └── todo/       — legacy
│   │   │   └── view/           — shared UI layer
│   │   │       ├── pages/      — page components
│   │   │       ├── layouts/    — layout wrappers
│   │   │       ├── components/ — shared presentational components
│   │   │       ├── ui/         — low-level primitives
│   │   │       └── router/     — route definitions
│   │   └── CLAUDE.md
│   ├── web/                    — Next.js marketing/landing
│   │   └── app/
│   │       ├── (auth)/
│   │       └── (dashboard)/
│   └── cli/                    — Boilerplate generator
│       └── src/
│           ├── commands/
│           └── lib/
├── packages/
│   ├── contracts/              — Shared DTOs + Zod schemas (SOURCE OF TRUTH)
│   │   └── src/
│   │       ├── auth/           — auth entities, signin, signup, profile, account
│   │       ├── tasks/          — Task, TaskDto, routes (create, inbox, today, delete, completion)
│   │       ├── projects/       — ProjectDto, routes (create, get-all, get-detail, delete, summary)
│   │       ├── sections/       — SectionDto, routes (create, get-all)
│   │       ├── settings/       — settings entities & routes
│   │       ├── todo/           — LEGACY (do not use for new code)
│   │       ├── enums/
│   │       └── common/         — shared helpers (PaginatedResponse<T>)
│   ├── ui/                     — Shared React component library
│   ├── logger/                 — Shared logger
│   ├── typescript-config/      — Shared tsconfig bases
│   └── vitest-preset/
│       ├── browser/            — happy-dom config for SPA
│       └── node/               — node config for API
├── docs/                       — Documentation
│   ├── database-design.md      — DynamoDB single-table schema (comprehensive)
│   ├── schema-pattern.md       — contracts → API → SPA validation pattern
│   ├── entities.md             — entity diagrams and relationships
│   ├── access-patterns.md      — DynamoDB access pattern docs
│   └── contracts-package.md    — contracts package structure
├── plans/                      — Implementation plans (Markdown)
├── .specs/                     — Spec-driven development docs
├── CLAUDE.md                   — Project identity & conventions (root)
├── biome.json
├── lefthook.yml
├── turbo.json
├── pnpm-workspace.yaml
├── knip.config.ts
└── tsconfig.base.json
```

## Module Organization

### API Modules (`apps/api/src/app/modules/`)

| Module | Purpose | Key features |
|--------|---------|-------------|
| `auth/` | Authentication | Cognito sign-in/sign-up, profile |
| `tasks/` | Task management | Create, get-inbox, get-today, complete, delete |
| `projects/` | Project management | CRUD + summary (task counts by project) |
| `sections/` | Section management | Sub-groups within projects |
| `settings/` | User settings | Get/update user preferences |
| `todos/` | Legacy todo | Kept for backwards compat |

### SPA Modules (`apps/spa/src/modules/`)

| Module | Purpose | Key files |
|--------|---------|-----------|
| `auth/` | Authentication UI | Login form, signup, auth guard |
| `tasks/` | Task CRUD | Inbox, today view, create/edit forms |
| `projects/` | Project UI | Project list, detail view, forms |
| `sections/` | Section UI | Within project views |
| `settings/` | Settings UI | User preference forms |
| `goals/` | Goals feature | Under development |
| `todo/` | Legacy | Do not extend |

## Where Things Live

**Lambda handlers:**
- Location: `apps/api/src/server/functions/<domain>/<action>.ts`
- Examples: `functions/tasks/get-today-tasks.ts`, `functions/tasks/create-task.ts`
- Note: must be listed in `knip.config.ts` entry points

**Serverless config:**
- Main: `apps/api/serverless.yml`
- CloudFormation resources: `apps/api/serverless/resources/`

**Shared types:**
- Location: `packages/contracts/src/<domain>/`
- Import: `@repo/contracts/<domain>/<path>`

**Query keys:**
- SPA: `apps/spa/src/app/config/query-keys.ts` (QUERY_KEYS factory)

**Route paths:**
- SPA: `apps/spa/src/app/config/routes.ts`

**HTTP client:**
- SPA: `apps/spa/src/app/services/http-client.ts` (Axios with JWT interceptor)
