# SPA Testing Conventions

## Test Naming

- **Language:** English
- **Pattern:** `Should <expected behavior> when <condition>`
- Suite names: use the function/class name being tested

Examples:
```
"Should return false when cache is empty"
"Should set completed to true and completedAt to ISO string when completing"
"Should populate sections cache without inbox section when fetch succeeds"
"Should leave cache intact when task does not exist"
```

## Test Structure (AAA)

Every test follows **Arrange-Act-Assert** with comment markers and blank line separators:

```ts
it("Should append task with PENDING state when section exists", () => {
  // Arrange
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKey, buildProjectDetail());

  // Act
  projectDetailCache(queryClient, "p1").addFullTaskToSection("s1", buildTask());

  // Assert
  const result = queryClient.getQueryData(queryKey);
  expect(result.sections[0].tasks).toHaveLength(2);
  expect(result.sections[0].tasks[1].optimisticState).toBe(OptimisticState.PENDING);
});
```

## Test File Organization

- **Co-located** with source: `<file>.test.ts` next to the source file
- **One `describe` per function/method** being tested
- **Nesting:** `describe("factoryName") > describe("methodName") > it("Should...")`

## Testing Cache Helpers (Level 1 — Unit)

Cache helpers are pure state transformations over `QueryClient`. No React, no HTTP mocking.

**Pattern:**
1. Create a fresh `QueryClient`
2. Seed cache with `queryClient.setQueryData()` using builders
3. Call the cache method
4. Read back with `queryClient.getQueryData()`
5. Assert the new state

**Always cover:**
- Happy path — method works as expected
- Cache undefined / empty — method handles gracefully (no crash)
- Item not found — cache stays intact
- Multi-section/multi-item — finds correct target across collections

**Example:**
```ts
describe("patchTaskCompletionOptimistic", () => {
  it("Should set completed to true and completedAt to ISO string when completing", () => {
    // Arrange
    const queryClient = new QueryClient();
    const detail = buildProjectDetail({
      sections: [buildSectionWithTasks({ id: "s1", tasks: [buildTask({ id: "t1" })] })],
    });
    queryClient.setQueryData(queryKey, detail);

    // Act
    projectDetailCache(queryClient, "p1").patchTaskCompletionOptimistic("t1", true);

    // Assert
    const result = queryClient.getQueryData(queryKey);
    const task = result.sections[0].tasks[0];
    expect(task.completed).toBe(true);
    expect(task.completedAt).toEqual(expect.any(String));
  });
});
```

## Testing Query Hooks (Level 2 — Integration)

Hook tests use `renderHook` + mocked service to verify data fetching and side effects.

**Pattern:**
1. `vi.mock("../services/<service>")` at top of file
2. Create `QueryClient` via `createTestQueryClient()`
3. `renderHook(() => useHook(params), { wrapper: createQueryWrapper(qc) })`
4. `await waitFor(() => expect(...))` for async assertions

**Always cover:**
- Happy path — data returned correctly
- Side effects — cache population, filtering logic
- Enabled/disabled conditions
- Error state
- Loading state

**Example:**
```ts
it("Should populate sections cache without inbox section when fetch succeeds", async () => {
  // Arrange
  const qc = createTestQueryClient();
  vi.mocked(getProjectDetail).mockResolvedValue(mockResponseWithInbox);

  // Act
  renderHook(() => useGetProjectDetail({ projectId: "p1" }), {
    wrapper: createQueryWrapper(qc),
  });

  // Assert
  await waitFor(() => {
    const cached = qc.getQueryData(QUERY_KEYS.SECTIONS.BY_PROJECT("p1"));
    expect(cached.sections).toHaveLength(2);
    expect(cached.sections.map(s => s.id)).not.toContain("inbox");
  });
});
```

## Test Utilities

### Builders (`@test/builders`)
Factory functions that return full entities with sensible defaults. Accept `Partial<T>` overrides.

| Builder | Returns |
|---------|---------|
| `buildTask(overrides?)` | `Task` |
| `buildSection(overrides?)` | `Section` |
| `buildSectionWithTasks(overrides?)` | `SectionsWithTasks` |
| `buildProject(overrides?)` | `Project` |
| `buildProjectDetail(overrides?)` | `ProjectDetailWithOptimisticState` |

### Query Client (`@test/query-client`)

| Utility | Purpose |
|---------|---------|
| `createTestQueryClient()` | `QueryClient` with `retry: false`, infinite stale/gc time |
| `createQueryWrapper(qc?)` | `QueryClientProvider` wrapper for `renderHook` |

## Running Tests

```bash
# Single test file
pnpm --filter spa test -- --run path/to/file.test.ts

# All SPA tests
pnpm --filter spa test

# Watch mode
pnpm --filter spa test -- --watch
```
