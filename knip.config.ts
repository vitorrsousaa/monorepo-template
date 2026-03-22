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
    },
    // SPA — Vite app (vite plugin disabled: @vitejs/plugin-react not resolvable from root)
    "apps/spa": {
      entry: ["src/main.tsx", "src/app/config/routes.ts"],
      project: ["src/**/*.{ts,tsx}"],
      vite: false,
    },
    // Web — Next.js (app router)
    "apps/web": {
      entry: ["app/**/*.{ts,tsx}", "next.config.*"],
      project: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    },
    // CLI — commander entry
    "apps/cli": {
      entry: ["src/index.ts"],
      project: ["src/**/*.ts"],
    },
    // Packages — use their published exports as entries
    "packages/contracts": {
      entry: ["src/**/index.ts"],
      project: ["src/**/*.ts"],
    },
    "packages/ui": {
      entry: ["src/index.ts"],
      project: ["src/**/*.{ts,tsx}"],
    },
    "packages/logger": {
      entry: ["src/index.ts"],
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
