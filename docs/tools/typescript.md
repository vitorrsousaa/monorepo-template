# TypeScript

[TypeScript](https://www.typescriptlang.org/) adds static typing to JavaScript.

## Contents

- [Shared Configuration](#shared-configuration)
- [Setup](#setup)

## Shared Configuration

The project uses the `@repo/typescript-config` package which provides shared TypeScript configurations for different project types:

- `base.json` - Base configuration for all projects
- `react-library.json` - For React libraries
- `nextjs.json` - For Next.js projects

## Setup

- Add workspace reference to `@repo/typescript-config`:

  ```sh
  pnpm add -D @repo/typescript-config
  ```

- Add TypeScript configuration file:

  ```jsonc
  // packages/your-package/tsconfig.json

  {
    "extends": "@repo/typescript-config/react-library.json",
    "compilerOptions": {
      "outDir": "dist",
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
      },
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"],
  }
  ```

For Node.js projects without React, use `base.json`:

```jsonc
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
}
```

[⬅ Back](../../README.md)
