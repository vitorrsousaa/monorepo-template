# Claude Skills — Best Practices for Monorepos

## Skills vs CLAUDE.md

| Aspect | CLAUDE.md | Skills (.claude/skills/) |
|--------|-----------|--------------------------|
| Loading | Automatic — ancestor files loaded on every conversation | On-demand — description always in context, full content loaded when invoked |
| Purpose | Conventions, architecture, rules | Reusable workflows, step-by-step procedures |
| Scope | Always-on context | Invoked by user or triggered by patterns |

## Skill Locations (priority order)

1. **Enterprise** — managed by org admins (highest priority)
2. **Personal** — `~/.claude/skills/` (user-level, across all projects)
3. **Project** — `.claude/skills/` (repo-level, shared with team)

## Monorepo Strategy

- **Root `.claude/skills/`** — shared workflows (commit conventions, review checklists, deploy procedures)
- **Package-level** — `packages/<pkg>/.claude/skills/` or `apps/<app>/.claude/skills/` — discovered automatically when editing files in that package
- Skills are **discovered on-demand**: descriptions stay in context, full content loads only when the skill is invoked

## Writing Good Skills

- **Descriptions are always loaded** — keep them concise (1-2 sentences) so they don't bloat context
- **Content can be detailed** — step-by-step instructions, code templates, checklists
- **Use namespaced names** — e.g., `api-new-feature.md`, `spa-add-route.md` to avoid collisions
- **Trigger patterns** — skills can auto-trigger based on file patterns or keywords in user messages

## When to Use Skills vs CLAUDE.md

| Scenario | Use |
|----------|-----|
| "Always use Biome, never ESLint" | CLAUDE.md (convention) |
| "How to add a new API endpoint" | Skill (step-by-step workflow) |
| "Path aliases for this app" | CLAUDE.md (reference info) |
| "Review this PR for security issues" | Skill (checklist procedure) |

## Current Project Assessment

The current setup (hierarchical CLAUDE.md + `.claudeignore` + `MEMORY.md`) covers conventions well. Skills make sense when:

- There are **repetitive workflows** that benefit from step-by-step guidance
- Different team members need to **invoke the same procedure** consistently
- A workflow is **too detailed for CLAUDE.md** but needed on-demand
