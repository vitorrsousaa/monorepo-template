# Monorepo Starter Template (test)

The purpose of this configuration is to ensure strict coding standards and facilitate coding experience using monorepo.

## Intro

This monorepo consist in these packages:

```bash
└─ monorepo # <- monorepo root package
   ├─ apps
   │  ├─ api # <- typescript server application
   │  ├─ client # <- typescript react application
   │  └─ cli # <- cli application
   │  └─ storefront # <- typescript next application
   └─ packages
      ├─ @shared/config-css # <- css config files used throughout the monorepo
      ├─ @shared/config-typescript # <- tsconfig.json's used throughout the monorepo
      ├─ @shared/logger # <- isomorphic logger (a small wrapper around console.log)
      ├─ @shared/vitest-presets # <- Vitest configurations
      └─ @shared/ui # <- a dummy React UI library with tailwindcss and shadcn
```

## Configuration

### Core

- [Git](/docs/core/git.md)

### Monorepo

- [Monorepo](/docs/packages/monorepo.md)

### Packages

- [@repo/logger](/docs/packages/logger.md) - Sistema de logging compartilhado
- [@repo/ui](/docs/packages/ui.md) - Componentes React compartilhados
- [@repo/typescript-config](/docs/packages/typescript-config.md) - Configurações TypeScript compartilhadas
- [@repo/vitest-presets](/docs/packages/vitest-presets.md) - Configurações Vitest compartilhadas

### Tools

- [Biome](/docs/tools/biome.md) - Linting e formatação
- [CommitLint](/docs/tools/commitlint.md) - Validação de commits
- [Lefthook](/docs/tools/lefthook.md) - Git hooks
- [TypeScript](/docs/tools/typescript.md) - Configuração TypeScript
- [Vitest](/docs/tools/vitest.md) - Configuração de testes

### Lib | `react`

- [React Lib](https://react.dev/)

### App | `next`

- [Next App](https://nextjs.org/)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
