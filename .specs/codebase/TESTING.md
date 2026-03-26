# Testing Infrastructure

## Test Frameworks

- **Unit/Integration:** Vitest 3.2.4
- **Coverage:** `@vitest/coverage-v8`
- **DOM environment (SPA):** happy-dom (via `@repo/vitest-presets/browser`)
- **Integration DB:** DynamoDB Local (Docker)

## Test Organization

**Location:** Co-located with source files
**Naming:** `*.test.ts` (unit) / `*.integration.test.ts` (integration)
**Shared utilities:** `apps/api/src/test/` — builders, mocks, setup

## Testing Patterns

### API Unit Tests

**Approach:** Test services in isolation using mock repositories.
**Location:** Co-located in `services/<action>/service.test.ts`

```typescript
// apps/api/src/app/modules/tasks/services/get-today-tasks/service.test.ts
describe("GetTodayTasksService", () => {
  const taskRepo = mockTasksRepository();        // from src/test/mocks/
  const projectRepo = mockProjectsRepository();

  const sut = new GetTodayTasksService(taskRepo, projectRepo);

  it("should group tasks by project with Inbox first", async () => {
    vi.mocked(taskRepo.getTodayTasks).mockResolvedValue([
      buildTask({ projectId: null }),   // from src/test/builders/
      buildTask({ projectId: "proj-1" }),
    ]);
    vi.mocked(projectRepo.getById).mockResolvedValue(buildProject({ id: "proj-1" }));

    const result = await sut.execute({ userId: "u-1" });

    expect(result.projects[0].projectId).toBeNull();    // Inbox first
    expect(result.projects).toHaveLength(2);
  });
});
```

**Mock repositories:** `src/test/mocks/mock-tasks-repository.ts`
```typescript
export function mockTasksRepository(): jest.Mocked<ITasksRepository> {
  return {
    getTodayTasks: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    // ...
  };
}
```

**Builders:** `src/test/builders/build-task.ts`
```typescript
export function buildTask(overrides?: Partial<Task>): Task {
  return {
    id: "task-default-id",
    title: "Default Task Title",
    projectId: null,
    dueDate: new Date(),
    completed: false,
    ...overrides,
  };
}
```

### API Integration Tests

**Approach:** Hit real DynamoDB Local table, test full repository behavior.
**Location:** `*.integration.test.ts` co-located with repos
**Setup:** `apps/api/src/test/setup-integration.ts` — creates DynamoDB Local table

**Commands:**
```bash
pnpm --filter api test:integration:up    # start DynamoDB Local (Docker)
pnpm --filter api test:integration       # run integration tests
pnpm --filter api test:integration:down  # stop DynamoDB Local
```

### SPA Tests

**Environment:** happy-dom (via `@repo/vitest-presets/browser`)
**Approach:** Component + hook tests; coverage minimal (see CONCERNS.md)

## Test Execution

```bash
# API
pnpm --filter api test:unit        # all *.test.ts
pnpm --filter api test:watch       # watch mode
pnpm --filter api test:coverage    # with v8 coverage

# SPA (if configured)
pnpm --filter spa test

# Root
pnpm test                          # Turborepo runs all workspaces
```

## Test Configuration

**Shared preset locations:**
- API: `packages/vitest-preset/node/` — node environment
- SPA: `packages/vitest-preset/browser/` — happy-dom environment

**Per-workspace `vitest.config.ts`** imports the preset and extends it:
```typescript
import { defineConfig } from "vitest/config";
import preset from "@repo/vitest-presets/node";

export default defineConfig({ ...preset });
```

## Coverage Targets

- **Current:** Minimal — most service files have placeholder tests
- **Goals:** Not formally documented
- **Enforcement:** Not enforced in CI yet (see CONCERNS.md — test coverage gap)
- **Note from CLAUDE.md:** "Tests: PLACEHOLDER — test files exist but coverage is minimal"
