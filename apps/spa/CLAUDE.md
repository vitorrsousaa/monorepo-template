# SPA — Claude Context

Stack: React + Vite + TanStack Query + TypeScript. Partial feature-sliced design.

## Directory Structure

```
src/
  app/           — Cross-cutting: services, hooks, contexts, config, libs, utils, entities
    services/    — HTTP clients and API call functions
    hooks/       — Shared hooks (useDebounce, etc.)
    contexts/    — React contexts (AuthContext, etc.)
    config/      — routes.ts, query-keys.ts, storage.ts, constants.ts, environment.ts
    libs/        — Third-party wrappers (query.tsx = QueryClient config)
    utils/       — Pure utility functions
    entities/    — App-level TypeScript types/interfaces
    storage/     — localStorage abstraction
  modules/       — Feature modules (auth, goals, projects, sections, settings, todo)
    <feature>/
      components/  — Feature-specific components
      hooks/       — Feature-specific hooks (useXQuery, useXMutation)
      services/    — Feature-specific API calls
      view/        — Feature pages (used by router)
  view/          — Shared UI layer
    pages/       — Route-level page components
    layouts/     — Layout wrappers
    components/  — Shared presentational components
    ui/          — Low-level UI primitives
  auth/          — Auth module (login, register)
```

## Path Aliases

Source: `apps/spa/tsconfig.app.json`

| Alias | Resolves to |
|-------|------------|
| `@/pages/*` | `src/view/pages/*` |
| `@/layouts/*` | `src/view/layouts/*` |
| `@/components/*` | `src/view/components/*` |
| `@/ui/*` | `src/view/ui/*` |
| `@/utils/*` | `src/app/utils/*` |
| `@/services/*` | `src/app/services/*` |
| `@/hooks/*` | `src/app/hooks/*` |
| `@/contexts/*` | `src/app/contexts/*` |
| `@/storage/*` | `src/app/storage/*` |
| `@/config/*` | `src/app/config/*` |
| `@/libs/*` | `src/app/libs/*` |
| `@/entities/*` | `src/app/entities/*` |
| `@/modules/*` | `src/modules/*` |

## Adding a New Feature — Steps

1. **Entity type**: `src/app/entities/<feature>.ts` (or import from `@repo/contracts`)
2. **Service**: `src/modules/<feature>/services/<feature>-service.ts` (calls `httpClient`)
3. **Query/Mutation hooks**: `src/modules/<feature>/hooks/use-<feature>-query.ts`
4. **Components**: `src/modules/<feature>/components/`
5. **View/Page**: `src/modules/<feature>/view/<FeaturePage>.tsx`
6. **Route**: register in `src/app/config/routes.ts`
7. **Query key**: add to `src/app/config/query-keys.ts`

## SPA Routes

From `src/app/config/routes.ts`:

| Path | Feature |
|------|---------|
| `/login`, `/signup`, `/google/callback` | Auth |
| `/todo/inbox` | Inbox view |
| `/todo/dashboard` | Todo dashboard |
| `/todo/today` | Today view |
| `/todo/upcoming` | Upcoming view |
| `/todo/completed` | Completed view |
| `/goals/dashboard` | Goals dashboard |
| `/projects`, `/projects/:id` | Projects list/detail |
| `/user`, `/user/settings`, `/user/support` | User profile/settings |

## CRITICAL: TanStack Query Config

File: `src/app/libs/query.tsx`

```ts
defaultOptions: {
  queries: {
    staleTime: Number.POSITIVE_INFINITY,  // Data NEVER goes stale — intentional
    gcTime: 1000 * 60 * 60,              // 1 hour cache retention
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,               // INTENTIONAL — don't re-fetch on remount
    refetchOnReconnect: false,
  }
}
```

**Strategy: fetch once, invalidate manually via `queryClient.invalidateQueries()`.**
Do NOT change these settings. Do NOT add `refetchOnMount: true` or remove `staleTime`.

## Optimistic Updates — cancelQueries Order

**Rule: always call `cancelQueries` BEFORE `setQueryData`.**

`cancelQueries` cancels in-flight refetches that would overwrite the optimistic value. If called after `setQueryData`, a race condition can reset the cache with stale server data.

**Wrong:**
```ts
// WRONG — race condition: in-flight query may overwrite the optimistic value
onMutate: async (newData) => {
  const previous = queryClient.getQueryData(queryKey);
  queryClient.setQueryData(queryKey, newData);       // ← set first
  await queryClient.cancelQueries({ queryKey });     // ← cancel too late
  return { previous };
},
```

**Correct:**
```ts
// CORRECT — cancel first, then write the optimistic value
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey });     // ← cancel first
  const previous = queryClient.getQueryData(queryKey);
  queryClient.setQueryData(queryKey, newData);       // ← then set
  return { previous };
},
onError: (_err, _vars, context) => {
  queryClient.setQueryData(queryKey, context?.previous);
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey });
},
```

## HTTP Client

File: `src/app/services/http-client.ts`

- Axios instance with `baseURL: VITE_API_BASE_URL`
- Auth: reads `ACCESS_TOKEN` from localStorage via `STORAGE_KEYS.ACCESS_TOKEN`, adds `Authorization: Bearer <token>` header
- Dev mode: artificial `delay()` on every response (intentional for UX testing)

## Key Config Files

| File | Purpose |
|------|---------|
| `src/app/config/routes.ts` | All route path constants |
| `src/app/config/query-keys.ts` | All TanStack Query keys |
| `src/app/config/storage.ts` | `STORAGE_KEYS` constants |
| `src/app/config/constants.ts` | App-wide constants |
| `src/app/config/environment.ts` | Env var access |

## UI Conventions

- Components: import from `@repo/ui`
- Icons: `lucide-react`
- Class merging: `cn()` from `@repo/ui/utils`
- Never import raw Tailwind utilities directly in shared components — use `@repo/ui`
