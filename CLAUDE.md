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

## CRITICAL: Component Reuse (SPA)

Before creating a new UI component, check if an equivalent already exists. When the same visual element appears in two or more places, **extract it into a shared component** instead of duplicating. If it's unclear whether to share or duplicate, **ask the user first**.

### Where shared SPA components live

| Scope | Location | Alias |
|-------|----------|-------|
| Cross-module UI (used by ≥2 features) | `apps/spa/src/view/components/<name>/` | `@/components/<name>` |
| App-wide utilities (pure functions) | `apps/spa/src/app/utils/` | `@/utils/<name>` |

### Current shared components

| Component | Path | Used by |
|-----------|------|---------|
| `PriorityBadge` | `view/components/priority-badge/` | `TaskRow` (inbox/project lists), `ProjectColumn` (today kanban) |
| `TaskRow` | `view/components/task-row/` | Inbox, project detail, dashboard |
| `TaskListCard` | `view/components/task-list-card/` | Inbox, project sections |

**Rule:** if you find yourself writing the same JSX structure in two files, stop and extract. Each shared component gets its own folder with `component.tsx` + `index.ts` barrel.

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

## CRITICAL: Documentation Analysis on Every Plan

Every plan **must include an explicit phase** called `## Documentation Analysis` as the **last phase** before closing. This phase is non-optional and must be executed as part of the plan, not after it.

### What this phase does

During planning you read code, discovered patterns, and understood the area deeply. That context must be persisted so future conversations don't rediscover it. The phase analyzes what was learned and creates/updates `CLAUDE.md` files accordingly.

### Mandatory steps inside the Documentation Analysis phase

1. **List areas explored** — enumerate every module, file, or flow you read during planning.
2. **Identify knowledge gaps** — for each area, check if a `CLAUDE.md` already covers it. If not, flag it as a candidate for a new file.
3. **Create or update `CLAUDE.md` files** — execute the changes (see rules below).
4. **Update `Related documentation` links** — add links in the nearest parent `CLAUDE.md`.

### Rules for CLAUDE.md files

- **Max 250 lines per file** — stay focused. Trim if a file grows beyond this.
- **Must include at least one code example** per non-trivial pattern. Examples are the fastest way for future Claude to understand intent.
- **Structure:** title → one-line purpose → sections with headers → examples inline.
- Check existing files first — never duplicate content.

#### Example of a good CLAUDE.md section

```markdown
## Cache Helpers

Never call `queryClient.setQueryData` directly — always use a cache helper factory.

**Why:** keeps invalidation logic in one place; hooks stay thin.

\`\`\`ts
// ✅ correct
import { makeProjectsAllCache } from "../cache/projects-all.cache";
const cache = makeProjectsAllCache(queryClient);
cache.add(newProject);

// ❌ wrong — direct mutation leaks cache shape into hooks
queryClient.setQueryData(["projects"], (old) => [...old, newProject]);
\`\`\`

Files: `modules/<feature>/app/cache/<name>.cache.ts`
```

### Where to create new CLAUDE.md files

| Scope | Location |
|-------|----------|
| Module-specific (SPA) | `apps/spa/src/modules/<feature>/CLAUDE.md` |
| Module-specific (API) | `apps/api/src/core/<layer>/CLAUDE.md` |
| Package-specific | `packages/<name>/CLAUDE.md` |
| Cross-cutting / architectural | Root `CLAUDE.md` (this file) |

### What qualifies as "new knowledge" worth persisting

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
- Overly verbose prose without examples — keep it concise and scannable

## DevContainer (Claude Sandbox)

Container Docker isolado para Claude Code. Firewall restritivo (`init-firewall.sh`) permite apenas GitHub, npm, Anthropic API, Sentry e VS Code Marketplace.

```bash
# VS Code: Cmd+Shift+P → "Dev Containers: Reopen in Container"
# CLI standalone:
docker compose -f .devcontainer/docker-compose.yml up -d
docker compose -f .devcontainer/docker-compose.yml exec claude-sandbox zsh
```

Estrutura: `.devcontainer/` (Dockerfile, devcontainer.json, docker-compose.yml, init-firewall.sh). Volumes nomeados persistem `~/.claude` e histórico de shell.

## Related documentation

### Apps
- [apps/api/CLAUDE.md](apps/api/CLAUDE.md) — API architecture, request flow, code patterns
- [apps/spa/CLAUDE.md](apps/spa/CLAUDE.md) — SPA structure, TanStack Query, UI conventions
- [apps/web/CLAUDE.md](apps/web/CLAUDE.md) — Next.js marketing site (scaffold)
- [apps/cli/CLAUDE.md](apps/cli/CLAUDE.md) — CLI boilerplate generator (`pnpm cosmos`)

### Packages
- [packages/contracts/CLAUDE.md](packages/contracts/CLAUDE.md) — shared types and usage
- [packages/ui/CLAUDE.md](packages/ui/CLAUDE.md) — component library (Radix + Tailwind)
- [packages/logger/CLAUDE.md](packages/logger/CLAUDE.md) — shared logging utility
- [packages/typescript-config/CLAUDE.md](packages/typescript-config/CLAUDE.md) — tsconfig bases
- [packages/vitest-preset/CLAUDE.md](packages/vitest-preset/CLAUDE.md) — shared test presets

### Docs
- [docs/schema-pattern.md](docs/schema-pattern.md) — schema pattern across layers
