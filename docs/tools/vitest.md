# Vitest

[Vitest](https://vitest.dev/) is a fast testing framework for JavaScript/TypeScript.

## Contents

- [Shared Configuration](#shared-configuration)
- [Setup](#setup)

## Shared Configuration

The project uses the `@repo/vitest-presets` package which provides pre-configured Vitest configurations:

- `browser/vitest.config.js` - For browser environment testing (React, etc.)
- `node/vitest.config.js` - For Node.js environment testing

## Setup

- Add workspace reference to `@repo/vitest-presets`:

  ```sh
  pnpm add -D @repo/vitest-presets
  ```

- Add Vitest configuration file:

  **For Browser/React projects:**

  ```js
  // packages/your-package/vitest.config.ts

  import { defineConfig } from "vitest/config";
  import configShared from "@repo/vitest-presets/browser/vitest.config.js";

  export default defineConfig({
    ...configShared,
    test: {
      ...configShared.test,
      // Your specific configurations here
    },
  });
  ```

  **For Node.js projects:**

  ```js
  // packages/your-package/vitest.config.ts

  import { defineConfig } from "vitest/config";
  import configShared from "@repo/vitest-presets/node/vitest.config.js";

  export default defineConfig({
    ...configShared,
    test: {
      ...configShared.test,
      // Your specific configurations here
    },
  });
  ```

[⬅ Back](../../README.md)
