# Monorepo

This project uses a monorepo managed with [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/).

## Contents

- [Structure](#structure)
- [Package Management](#package-management)
- [Scripts](#scripts)

## Structure

```
artemis/
├── apps/          # Applications (API, Web, CLI, etc.)
├── packages/      # Shared packages
└── docs/          # Documentation
```

### Apps

Complete applications that can run independently:

- `api` - Serverless API (AWS Lambda)
- `web` - Next.js application
- `spa` - Single Page Application
- `cli` - CLI tool

### Packages

Shared reusable packages across apps:

- `@repo/logger` - Shared logging system
- `@repo/ui` - Shared React components
- `@repo/typescript-config` - Shared TypeScript configurations
- `@repo/vitest-presets` - Shared Vitest configurations

## Package Management

### Installation

```sh
# Install all dependencies
pnpm install

# Install dependency in a specific package/app
pnpm --filter @repo/logger add <package>

# Install dependency in all packages
pnpm -r add <package>
```

### Workspace Protocol

To reference internal packages, use the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@repo/logger": "workspace:*"
  }
}
```

## Scripts

### Build

```sh
# Build all packages and apps
pnpm build

# Build a specific package/app
pnpm --filter @repo/logger build
```

### Development

```sh
# Run all dev servers
pnpm dev

# Run specific dev server
pnpm dev:api    # API
pnpm dev:web    # Next.js
pnpm dev:spa    # SPA
pnpm dev:cli    # CLI
pnpm dev:front  # SPA + UI package
```

### Linting and Formatting

```sh
# Lint all packages
pnpm lint

# Format all packages
pnpm format

# Typecheck all packages
pnpm typecheck
```

[⬅ Back](../../README.md)
