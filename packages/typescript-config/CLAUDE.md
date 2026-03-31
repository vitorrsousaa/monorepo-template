# @repo/typescript-config — Claude Context

Shared tsconfig bases for the monorepo. All apps and packages extend one of these.

## Available Bases

| Base | File | Used by |
|------|------|---------|
| **base** | `base.json` | Foundation for all others |
| **react-library** | `react-library.json` | `apps/spa`, `packages/ui` |
| **nextjs** | `nextjs.json` | `apps/web` |

## Key Settings (base.json)

- `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`
- `strict: true` + `noUncheckedIndexedAccess: true`
- `declaration: true` + `declarationMap: true`
- `isolatedModules: true`, `skipLibCheck: true`

## How to Consume

```json
// tsconfig.json in any app/package
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": { /* app-specific overrides */ }
}
```

## Differences Between Bases

- **react-library** adds `jsx: "react-jsx"` (React JSX transform)
- **nextjs** adds `jsx: "preserve"`, `allowJs: true`, `noEmit: true`, Next.js plugin
