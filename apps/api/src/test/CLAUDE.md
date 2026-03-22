# Test Utilities — Claude Context

Test infrastructure for the API: builders, mocks, and integration setup.

## Structure

```
test/
├── CLAUDE.md
├── setup-integration.ts   ← DynamoDB Local table creation + cleanup
├── builders/
│   ├── task-builder.ts
│   ├── project-builder.ts
│   ├── section-builder.ts
│   ├── request-builder.ts
│   ├── dynamo-entity-builder.ts
│   └── index.ts
└── mocks/
    ├── mock-tasks-repository.ts
    ├── mock-projects-repository.ts
    ├── mock-sections-repository.ts
    ├── mock-database-client.ts
    └── index.ts
```

## Builders

Simple factory functions with spread overrides. Import from `@test/builders`.

```ts
import { buildTask, buildProject, buildPrivateRequest } from "@test/builders";

// Use defaults
const task = buildTask();

// Override specific fields
const completedTask = buildTask({ completed: true, completedAt: "2024-06-10T00:00:00.000Z" });

// Build a controller request
const request = buildPrivateRequest({ body: { title: "Test" }, userId: "u-1" });
```

| Builder | Returns | Notes |
|---------|---------|-------|
| `buildTask(overrides?)` | `Task` (contracts) | Default: inbox, pending, no priority |
| `buildProject(overrides?)` | `Project` (contracts) | Default color: `#7F77DD` |
| `buildSection(overrides?)` | `Section` (contracts) | Default: `project-001` |
| `buildPrivateRequest(overrides?)` | `Controller.Request<'private'>` | Default userId: `user-001` |
| `buildTaskDynamoEntity(overrides?)` | `TasksDynamoDBEntity` | With PK/SK pre-built |

## Mocks

Repository mocks return objects with all methods as `vi.fn()`. Import from `@test/mocks`.

```ts
import { mockTasksRepository } from "@test/mocks";

const repo = mockTasksRepository();
vi.mocked(repo.getInbox).mockResolvedValue([buildTask()]);
```

| Mock | Interface |
|------|-----------|
| `mockTasksRepository(overrides?)` | `ITasksRepository` |
| `mockProjectsRepository(overrides?)` | `IProjectRepository` |
| `mockSectionsRepository(overrides?)` | `ISectionRepository` |
| `mockDatabaseClient(overrides?)` | `IDatabaseClient` |

Override specific methods:

```ts
const repo = mockTasksRepository({
  getInbox: vi.fn().mockResolvedValue([buildTask()]),
});
```

## Naming conventions

- Unit tests: `*.test.ts` (co-located with source)
- Integration tests: `*.integration.test.ts`
- Unit test config: `vitest.config.ts` (excludes `*.integration.test.ts`)
- Integration config: `vitest.integration.config.ts`

## Service test pattern

```ts
import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { MyService } from "./service";

describe("MyService", () => {
  const repo = mockTasksRepository();
  const sut = new MyService(repo);

  beforeEach(() => { vi.clearAllMocks(); });

  it("should do something", async () => {
    vi.mocked(repo.getByUserId).mockResolvedValue(buildTask());
    const result = await sut.execute({ userId: "u-1", taskId: "t-1" });
    expect(result.task.completed).toBe(false);
  });
});
```

## Controller test pattern

```ts
import { buildTask, buildPrivateRequest } from "@test/builders";
import { MyController } from "./controller";

describe("MyController", () => {
  const service = { execute: vi.fn() };
  const sut = new MyController(service);

  it("should return 200", async () => {
    service.execute.mockResolvedValue({ task: buildTask() });
    const request = buildPrivateRequest({ body: { title: "Test" } });
    const response = await sut.execute(request);
    expect(response.statusCode).toBe(200);
  });
});
```

## Integration tests (DynamoDB Local)

```bash
pnpm --filter api test:integration:up    # start DynamoDB Local via Docker
pnpm --filter api test:integration       # run integration tests
pnpm --filter api test:integration:down  # stop Docker
```

`setup-integration.ts` creates the table with PK/SK + GSI1/GSI3/GSI6 in `beforeAll`, and clears all items in `beforeEach`.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter api test:unit` | Run unit tests |
| `pnpm --filter api test:integration` | Run integration tests |
| `pnpm --filter api test:watch` | Watch mode |
