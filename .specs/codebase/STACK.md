# Tech Stack

**Analyzed:** 2026-03-26

## Core

- Language: TypeScript 5.9.3
- Package manager: pnpm 9.0.0 + Turborepo 2.3.3
- Node: >=18 (Lambda uses Node 22.x)
- Monorepo: pnpm workspaces (`apps/*`, `packages/*`)

## Backend (apps/api)

- Deployment: AWS Lambda + Serverless Framework 4.31.0
- Architecture: Clean Architecture (domain → data → app → factories → server)
- Database: AWS DynamoDB — single-table design via `@aws-sdk/lib-dynamodb` 3.1009.0
- Authentication: AWS Cognito JWT — validated by API Gateway Cognito authorizer
- ORM/Mapper: Custom DynamoDB mappers (no ORM)
- Validation: Zod 4.3.5 (at controller boundary via schemas in `@repo/contracts`)
- Logger: `@repo/logger` (shared workspace package)

## Frontend (apps/spa)

- Framework: React 19.2.3 + Vite
- Router: React Router 7.9.4 (SPA mode, via `react-router-dom`)
- State/Data fetching: TanStack Query 5.90.5
- Forms: React Hook Form 7.71.1
- HTTP client: Axios 1.13.2
- i18n: i18next 25.8.18 + react-i18next 16.5.8
- Icons: Lucide React 0.562.0
- Validation (forms): Zod 4.3.5 (imports constants from `@repo/contracts`)
- Component library: `@repo/ui` (shared workspace package)

## Marketing (apps/web)

- Framework: Next.js 15.1.0 (App Router)
- Components: `@repo/ui`

## CLI (apps/cli)

- Tool: Boilerplate generator (Commander.js 13.0.0, Inquirer 12.3.2, fs-extra 11.3.0)
- Binary: `cosmos` → `pnpm cosmos create`

## Shared Packages

- `@repo/contracts` — shared DTOs + Zod schemas (source of truth for API↔SPA types)
- `@repo/ui` — shared React component library
- `@repo/logger` — shared logger
- `@repo/typescript-config` — shared tsconfig bases
- `@repo/vitest-presets` — shared Vitest config (node + browser presets)

## Testing

- Framework: Vitest 3.2.4
- API unit tests: co-located `*.test.ts`, node environment
- API integration tests: `*.integration.test.ts` with DynamoDB Local (Docker)
- SPA tests: happy-dom environment (via `@repo/vitest-presets/browser`)
- Coverage: v8 (via `@vitest/coverage-v8`)

## External Services

- Auth: AWS Cognito User Pool (via Serverless CloudFormation)
- Database: AWS DynamoDB (via Serverless CloudFormation)
- Storage: AWS S3 (implied by Serverless setup)
- Deployment: AWS Lambda + API Gateway

## Development Tools

- Linter/formatter: Biome 1.9.4 (replaces ESLint + Prettier — never suggest those)
- Git hooks: Lefthook (pre-commit: lint+format, pre-push: typecheck, commit-msg: commitlint)
- Commit format: CommitLint — conventional commits enforced
- Dead code: Knip 6.0.1 (`pnpm knip` interactive, `pnpm ci:knip` CI)
- Build: Turborepo 2.3.3 (caches build/lint/typecheck tasks)
