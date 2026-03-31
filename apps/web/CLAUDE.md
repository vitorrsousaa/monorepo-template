# Web — Claude Context

Next.js marketing/landing site for LifeOS. Minimal scaffold, mostly placeholder pages.

## Stack

- **Framework:** Next.js 15 with Turbopack
- **Styling:** Tailwind CSS (extends `@repo/ui` config)
- **Theme:** `ThemeProvider` from `@repo/ui/providers`
- **Linter:** Biome (not ESLint)

## Structure

```
app/
├── layout.tsx        # Root layout (Geist fonts, ThemeProvider)
├── page.tsx          # Home page (stub)
├── providers.tsx     # Client-side ThemeProvider wrapper
├── (auth)/
│   ├── layout.tsx    # Auth layout (stub with commented redirect)
│   └── signin/
│       └── page.tsx  # Sign-in page (stub)
└── fonts/            # Geist font files
```

## Current State

This app is a **scaffold** — pages are stubs. No API integration, no auth flow, no content. Used for future marketing/landing pages.

## Commands

```bash
pnpm --filter web dev        # Dev server with Turbopack
pnpm --filter web build      # Production build
pnpm --filter web typecheck  # Type check
```

## Patterns

- Imports theme CSS from `@repo/ui/styles/theme.css`
- Uses `@repo/ui/providers` for ThemeProvider (client component)
- Tailwind config extends `@repo/ui/tailwind.config`
- PostCSS config extends `@repo/ui/postcss.config`
- tsconfig extends `@repo/typescript-config/nextjs.json`
