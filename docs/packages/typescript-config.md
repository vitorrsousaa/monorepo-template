# @repo/typescript-config

Shared TypeScript configurations to standardize development across the monorepo.

## Contents

- [Installation](#installation)
- [Available Configurations](#available-configurations)
- [Usage](#usage)

## Installation

```sh
pnpm add -D @repo/typescript-config
```

## Available Configurations

### base.json

Base configuration for all projects. Includes:

- Strict mode enabled
- ES2022 target
- Module resolution: Bundler
- Libs: ES2022, DOM, DOM.Iterable

### react-library.json

Configuration for React libraries. Extends `base.json` and adds:

- JSX: react-jsx

### nextjs.json

Configuration for Next.js projects. Extends `base.json` with Next.js-specific configurations.

## Usage

### For React Libraries

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

### For Node.js Projects

```jsonc
// packages/your-package/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
}
```

### For Next.js Apps

```jsonc
// apps/web/tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
    },
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"],
}
```

## Structure

```
packages/typescript-config/
├── base.json           # Base configuration
├── react-library.json  # For React libraries
├── nextjs.json         # For Next.js projects
└── package.json
```

[⬅ Back](../README.md)
