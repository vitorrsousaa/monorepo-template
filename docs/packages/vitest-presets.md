# @repo/vitest-presets

Shared Vitest configurations to standardize testing across the monorepo.

## Contents

- [Installation](#installation)
- [Available Presets](#available-presets)
- [Usage](#usage)

## Installation

```sh
pnpm add -D @repo/vitest-presets
```

## Available Presets

### browser/vitest.config.js

Configuration for browser environment testing (React, components, etc.). Includes:

- Environment: `happy-dom`
- JSX/TSX support
- Optimized configurations for React component testing

### node/vitest.config.js

Configuration for Node.js environment testing. Includes:

- Environment: Native Node.js
- Optimized configurations for API and business logic testing

## Usage

### For Browser/React Projects

```typescript
// packages/your-package/vitest.config.ts
import { defineConfig } from "vitest/config";
import configShared from "@repo/vitest-presets/browser/vitest.config.js";

export default defineConfig({
  ...configShared,
  test: {
    ...configShared.test,
    // Your specific configurations here
    globals: true,
  },
});
```

### For Node.js Projects

```typescript
// packages/your-package/vitest.config.ts
import { defineConfig } from "vitest/config";
import configShared from "@repo/vitest-presets/node/vitest.config.js";

export default defineConfig({
  ...configShared,
  test: {
    ...configShared.test,
    // Your specific configurations here
    globals: true,
  },
});
```

### Example with Custom Configuration

```typescript
// apps/api/vitest.config.ts
import { defineConfig } from "vitest/config";
import configShared from "@repo/vitest-presets/node/vitest.config.js";

export default defineConfig({
  ...configShared,
  test: {
    ...configShared.test,
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

## Structure

```
packages/vitest-preset/
├── browser/
│   └── vitest.config.js    # Browser configuration
├── node/
│   └── vitest.config.js     # Node.js configuration
└── package.json
```

[⬅ Back](../README.md)
