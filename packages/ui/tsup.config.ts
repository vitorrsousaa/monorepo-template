import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/components/**/*.tsx",
    "src/utils/index.ts",
    "src/providers/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  watch: process.env.NODE_ENV !== "production" ? ["src/**/*"] : false,
  esbuildOptions(options) {
    options.alias = {
      ...(options.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
  },
  external: ["react", "react-dom"],
});
