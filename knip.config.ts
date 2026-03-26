import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    // Root workspace
    ".": {
      entry: [],
      project: [],
    },
    // API — Lambda handlers; entry via serverless.yml handler refs
    "apps/api": {
      entry: [
        "src/server/functions/**/*.ts",
        "src/factories/**/*.ts",
      ],
      project: ["src/**/*.ts"],
      ignore: ["src/app/utils/types.ts"],
    },
    // SPA — Vite app (vite plugin disabled: @vitejs/plugin-react not resolvable from root)
    // Pages are added as entry points because React.lazy() dynamic imports with path aliases
    // (@/pages/*) are not resolvable by Knip without the Vite plugin — the full component
    // tree under lazily-loaded pages would otherwise be invisible and flagged as unused.
    "apps/spa": {
      entry: [
        "src/app/config/routes.ts",
        "src/view/pages/**/*.{ts,tsx}",
        "src/view/router/**/*.{ts,tsx}",
      ],
      project: ["src/**/*.{ts,tsx}"],
      vite: false,
    },
    // Web — Next.js (app router)
    "apps/web": {
      entry: ["next.config.*"],
      project: ["app/**/*.{ts,tsx}"],
    },
    // CLI — commander entry
    "apps/cli": {
      project: ["src/**/*.ts"],
    },
    // Packages — use their published exports as entries
    "packages/contracts": {
      entry: ["src/**/index.ts"],
      project: ["src/**/*.ts"],
    },
    // No root index.ts — exports via subpaths: ./components/*, ./utils, ./providers
    "packages/ui": {
      entry: [
        "src/components/**/*.{ts,tsx}",
      ],
      project: ["src/**/*.{ts,tsx}"],
      ignoreDependencies: ["@hookform/resolvers"],
    },
    "packages/logger": {
      project: ["src/**/*.ts"],
    },
    "packages/typescript-config": {
      entry: [],
      project: [],
    },
    "packages/vitest-preset": {
      entry: [
        "browser/vitest.config.js",
        "node/vitest.config.js",
      ],
      project: ["**/*.{js,ts}"],
    },
  },
};

export default config;
