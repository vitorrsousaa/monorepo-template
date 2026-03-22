# @repo/vitest-presets — Claude Context

Shared Vitest configuration presets for the monorepo.

## Presets

| Preset | Path | Environment | Used by |
|--------|------|-------------|---------|
| Node | `node/vitest.config.js` | Node.js (default) | `apps/api` |
| Browser | `browser/vitest.config.js` | `happy-dom` | `apps/spa` |

## Shared settings (both presets)

- `globals: true` — `describe`, `it`, `expect`, `vi` available without imports
- `coverage.provider: 'v8'` with thresholds (60% lines, 60% functions)
- `coverage.exclude`: `*.dto.ts`, `index.ts`, `index.tsx`
- Standard excludes: `node_modules`, `dist`, `coverage`, config files

## How to consume

```ts
// apps/api/vitest.config.ts
import configShared from "@repo/vitest-presets/node/vitest.config.js";
import { defineProject, mergeConfig } from "vitest/config";

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      include: ["src/**/*.test.ts"],
      exclude: ["src/**/*.integration.test.ts"],
    },
    resolve: { alias: { /* app-specific aliases */ } },
  }),
);
```

The app-specific config extends the preset via `mergeConfig` — add includes, excludes, aliases, and setup files locally.
