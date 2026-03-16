# LifeOS — Claude Context

## Project Identity

**LifeOS** (codename: Artemis) — personal productivity system. Task management with projects, sections, priorities, and due dates. Multi-tenant, user-isolated. Built as a monorepo.

## CRITICAL: Naming Convention

**`Task` is canonical. `Todo` is legacy — do not use for new code.**

- Source of truth: `apps/api/src/core/domain/task/task.ts` (comment: "Todo é o legado; novos fluxos usam Task")
- Wire format DTO: `packages/contracts/src/tasks/dto.ts` → `TaskDto`
- Legacy `Todo` still exists in repositories/services — do not rename, just don't create new `Todo` symbols

## Monorepo Structure

```
apps/
  api/        — AWS Lambda + Serverless Framework, Clean Architecture (port 4000)
  spa/        — React + Vite + TanStack Query (feature-sliced partial)
  web/        — Next.js (marketing/landing)
  cli/        — Boilerplate generator (pnpm cosmos create)
packages/
  contracts/  — Shared DTOs (source of truth for API↔SPA types)
  ui/         — Shared component library
  logger/     — Shared logger
  typescript-config/ — Shared tsconfig bases
  vitest-preset/     — Shared test config
```

**Key commands:**
- `pnpm dev:api` — API on port 4000
- `pnpm dev:spa` — SPA dev server
- `pnpm dev:front` — SPA + UI in watch mode
- `pnpm cosmos create` — generate boilerplate (run before creating files manually)
- `pnpm typecheck` — full monorepo typecheck

## Domain Entities

| Entity | Location | Notes |
|--------|----------|-------|
| Task | `apps/api/src/core/domain/task/task.ts` | Canonical; `Todo` is legacy |
| Todo | `apps/api/src/core/domain/todo/todo.ts` | Legacy; repo still uses it |
| Project | `apps/api/src/core/domain/project/` | Groups tasks |
| Section | `apps/api/src/core/domain/section/` | Sub-groups within projects |
| User | Future — not yet implemented |

## @repo/contracts

Shared DTOs live in `packages/contracts/`. **Always import from `@repo/contracts/...`** for types shared between API and SPA. Never duplicate DTO types.

## Code Quality

- **Linter/formatter: Biome** (not ESLint, not Prettier) — `biome.json` at root
- **Git hooks: Lefthook** — `lefthook.yml` at root
- **Commit format: CommitLint** — conventional commits enforced
- Never suggest ESLint/Prettier setup

## Current Dev State

- **Auth: Cognito JWT** — Cognito authorizer validates JWT tokens. `MOCK_USER_ID` descontinuado.
- **Repositories: DynamoDB** — Repos implementam acesso ao DynamoDB via `IDatabaseClient`.
- **Tests: PLACEHOLDER** — test files exist but coverage is minimal.
- **Serverless Offline: REMOVIDO** — migrado para deployment real ou alternativa.

See `apps/api/CLAUDE.md` and `apps/spa/CLAUDE.md` for app-specific details.

## Related documentation

- [packages/contracts/CLAUDE.md](packages/contracts/CLAUDE.md) — shared types and usage
