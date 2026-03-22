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
- **Dead code / unused deps: Knip** — `knip.config.ts` at root
- Never suggest ESLint/Prettier setup

### Knip

`pnpm knip` — interactive report. `pnpm ci:knip` — CI (no progress output, exits non-zero on findings).

Config: `knip.config.ts` at root. Each workspace declares explicit `entry` + `project` globs.

**When to update `knip.config.ts`:**
- **New workspace added** — add a new entry under `workspaces` with its `entry` and `project` globs.
- **New Lambda handler path** — add the glob to `entry` in `apps/api`; handlers not listed as entry points are flagged as unused files.
- **New SPA route file** — add it to `entry` in `apps/spa` if it's not reachable from `src/main.tsx`.
- **Confirmed false positive** — add to `ignoreDependencies` (for deps) or `ignore` (for files/exports) inside the relevant workspace block.

**Gotchas:**
- `apps/spa` has `vite: false` — Knip cannot load `vite.config.ts` from root because `@vitejs/plugin-react` is not root-resolvable. Entry points are declared manually instead.
- API Lambda handlers are under `src/server/functions/**/*.ts` (not `src/handlers/`). Must stay in `entry` or Knip flags them as unused.
- First-run report contains both real dead code and false positives — triage before enforcing CI failure. Use `ignoreDependencies`/`ignore` in `knip.config.ts` to suppress confirmed false positives.

## Current Dev State

- **Auth: Cognito JWT** — Cognito authorizer validates JWT tokens. `MOCK_USER_ID` descontinuado.
- **Repositories: DynamoDB** — Repos implementam acesso ao DynamoDB via `IDatabaseClient`.
- **Tests: PLACEHOLDER** — test files exist but coverage is minimal.
- **Serverless Offline: REMOVIDO** — migrado para deployment real ou alternativa.

See `apps/api/CLAUDE.md` and `apps/spa/CLAUDE.md` for app-specific details.

## Schema Pattern (Contracts → API → SPA)

Contracts is the **single source of truth** for validation. See [docs/schema-pattern.md](docs/schema-pattern.md) for full details.

- **Contracts**: exports validation constants (`TASK_TITLE_MAX`, etc.) + Zod schema + types
- **API Service DTO**: pure TS interface (extends contracts type + `userId`) — no Zod
- **SPA Form schema**: imports constants from contracts for min/max sync

## Plan Storage

When entering Plan Mode or creating implementation/architecture plans, **always save the plan as a Markdown file** in the `plans/` directory at the monorepo root.

- **File naming:** `plans/plan-<feature-name>.md` (kebab-case)
- **When to save:** After the plan is finalized/approved by the user, write it to disk before starting implementation
- **Format:** Include sections like Context, Phases/Steps, Implementation Details, and any relevant notes
- **Update:** If the plan changes during implementation, update the file to reflect the current state

## CRITICAL: Documentation Update on Every Plan

After finalizing any plan, you MUST update the project documentation with **every piece of new knowledge** you learned during the planning process. This is mandatory — do not skip it.

### What to update

Analyze everything you discovered while researching and planning (code patterns, architecture decisions, domain rules, data flows, conventions, gotchas) and persist it in `CLAUDE.md` files so future conversations have this context without re-discovering it.

### How to update

1. **Update existing `CLAUDE.md` files** — If the new knowledge relates to an area already documented (e.g., `apps/api/CLAUDE.md`, `apps/spa/CLAUDE.md`, `packages/contracts/CLAUDE.md`), add the information to the relevant section or create a new section in that file.

2. **Create new `CLAUDE.md` files** — If the knowledge is specific to a directory/module that doesn't have its own `CLAUDE.md` yet, create one. Examples:
   - `apps/spa/src/modules/tasks/CLAUDE.md` — if you learned deep details about the tasks module
   - `apps/api/src/core/domain/CLAUDE.md` — if you uncovered domain rules not documented elsewhere
   - `packages/ui/CLAUDE.md` — if you discovered patterns in the UI package

3. **Update the root `CLAUDE.md`** — If the knowledge is cross-cutting or architectural (affects multiple apps/packages), add it here and link to detailed docs if needed.

4. **Update `Related documentation` links** — When creating new `CLAUDE.md` files, add them to the nearest parent `CLAUDE.md`'s related documentation section.

### What qualifies as "new knowledge"

- Architecture patterns or conventions not yet documented
- Domain rules or business logic discovered in code
- Data flows between modules/services
- Naming conventions or code organization patterns
- Integration points (API ↔ SPA, contracts usage, cache strategies)
- Gotchas, edge cases, or non-obvious behaviors
- Dependencies between modules or features

### What NOT to add

- Ephemeral/temporary implementation details (those go in the plan file)
- Information already documented — check existing `CLAUDE.md` files first
- Overly verbose explanations — keep it concise and scannable like the existing docs

## Related documentation

- [packages/contracts/CLAUDE.md](packages/contracts/CLAUDE.md) — shared types and usage
- [docs/schema-pattern.md](docs/schema-pattern.md) — schema pattern across layers
