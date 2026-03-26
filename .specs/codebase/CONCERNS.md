# Concerns

## High Priority

### 1. Test Coverage — Minimal / Placeholder

**Risk:** Medium-High — regressions go undetected
**Evidence:** Root `CLAUDE.md` states "Tests: PLACEHOLDER — test files exist but coverage is minimal." Most service test files exist but contain basic happy-path cases only.
**Affected area:** `apps/api/src/app/modules/*/services/*/service.test.ts`

**Fix approach:**
- Prioritize service layer tests (pure business logic, easy to test with mock repos)
- Add edge cases: empty results, missing projectId (Inbox), concurrent task updates
- Consider enforcing coverage thresholds in `vitest.config.ts` per workspace

---

### 2. DynamoDB Repositories — Partial Real Implementation

**Risk:** Medium — some repository methods may be stubs or in-memory mocks
**Evidence:** From git status, `tasks-dynamo-repository.ts` and `task-mapper.ts` are actively being modified. Some methods may use in-memory fallbacks rather than real DynamoDB queries.
**Affected area:** `apps/api/src/infra/db/dynamodb/repositories/`

**Fix approach:**
- Audit each I*Repository method for stub implementations
- Replace stubs with real DynamoDB queries using proper PK/SK patterns
- Add integration tests (`*.integration.test.ts`) for each repository method

---

### 3. GSI Index Usage Without Existence Verification

**Risk:** Medium — using a GSI that doesn't exist in CloudFormation causes runtime errors
**Evidence:** Feedback memory documents a past incident where GSI was used in code before it was activated in `Database.yml`.
**Affected area:** `apps/api/src/infra/db/dynamodb/repositories/`, `apps/api/serverless/resources/Database.yml`

**Fix approach:**
- Before adding any GSI-based query, verify the index is defined in `Database.yml`
- Consider adding a checklist step in CLAUDE.md for GSI usage

---

## Medium Priority

### 4. Legacy `Todo` Entity Coexisting with `Task`

**Risk:** Low-Medium — naming confusion for new contributors; risk of new code using wrong entity
**Evidence:** Both `Task` and `Todo` entities exist. `Todo` is legacy but still in repositories and services. The codebase has both `ITodoRepository` and `ITasksRepository`.
**Affected area:** `apps/api/src/core/domain/todo/`, `apps/api/src/app/modules/todos/`, `packages/contracts/src/todo/`

**Fix approach:**
- No immediate action needed — rule is "don't create new Todo symbols"
- Long-term: migrate remaining Todo flows to Task, then delete Todo code
- Track in project roadmap

---

### 5. `MOCK_USER_ID` Legacy References

**Risk:** Low-Medium — security risk if mock IDs reach production
**Evidence:** `CLAUDE.md` states "MOCK_USER_ID descontinuado. Remover quando encontrado em mocks antigos."
**Affected area:** `apps/api/src/infra/db/dynamodb/repositories/mock-ids.ts` and any files importing it

**Fix approach:**
- `grep -r "MOCK_USER_ID"` to find all references
- Replace with proper test fixtures using `buildPrivateRequest()` which uses a real userId pattern
- Delete `mock-ids.ts` after removing all references

---

### 6. `serverless-offline` Removed — No Local Dev Environment

**Risk:** Medium — slower iteration loop; developers must deploy to test Lambda behavior
**Evidence:** `CLAUDE.md` states "Serverless Offline: REMOVIDO — migrado para deployment real ou alternativa."
**Affected area:** Local development workflow

**Fix approach:**
- Consider adding a local testing strategy (e.g., Vitest integration tests against DynamoDB Local)
- Or document the current recommended dev workflow (deploy to a dev stage per developer)
- DynamoDB Local (Docker) already set up for integration tests — could be extended

---

### 7. SPA `todo` Module (Legacy)

**Risk:** Low — unused legacy UI module adds dead code
**Evidence:** `apps/spa/src/modules/todo/` exists alongside `tasks/`. Knip may or may not flag it.
**Affected area:** `apps/spa/src/modules/todo/`

**Fix approach:**
- Verify the todo SPA module has no active routes
- If confirmed unused, remove it and update `knip.config.ts`

---

## Low Priority

### 8. Knip False Positives in CI

**Risk:** Low — CI may fail on false positives; developers may ignore real issues
**Evidence:** `CLAUDE.md` mentions "First-run report contains both real dead code and false positives — triage before enforcing CI failure."
**Affected area:** `knip.config.ts`, CI pipeline

**Fix approach:**
- Run `pnpm knip` and triage output
- Add confirmed false positives to `ignoreDependencies`/`ignore` in `knip.config.ts`
- Enable `pnpm ci:knip` failure in CI only after triage is complete

---

### 9. Minimal i18n Coverage in SPA

**Risk:** Low — i18n infrastructure exists but coverage may be incomplete
**Evidence:** `i18next` is installed and configured but unknown how many strings are actually translated.
**Affected area:** `apps/spa/src/app/libs/i18n`, translation files

**Fix approach:**
- Audit for hardcoded strings vs i18n keys
- Establish a policy (EN-only is fine if intentional)

---

## Notes

- `apps/web` (Next.js marketing) appears minimally developed — not a concern for core product
- `apps/cli` boilerplate generator is stable and well-contained
- No security vulnerabilities identified in auth flow — Cognito JWT + API Gateway authorizer is robust
- DynamoDB single-table design is well-documented in `docs/database-design.md`
