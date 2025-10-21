const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    environment: "happy-dom",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/html/**",
      "**/coverage/**",
    ],
    reporters: ["basic"],
    coverage: {
      provider: "v8",
    },
    globals: true,
  },
});