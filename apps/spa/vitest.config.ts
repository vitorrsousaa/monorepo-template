import path from "node:path";
// @ts-ignore
import configShared from "@shared/vitest-presets/browser/vitest.config";
import { defineProject, mergeConfig } from "vitest/config";

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      globals: true,
    },
    resolve: {
      alias: {
        "@/screens": path.resolve(__dirname, "./src/view/screens"),
        "@/ui": path.resolve(__dirname, "./src/view/ui"),
        "@/components": path.resolve(__dirname, "./src/view/components"),
        "@/layouts": path.resolve(__dirname, "./src/view/layouts"),
        "@/utils": path.resolve(__dirname, "./src/app/utils"),
        "@/services": path.resolve(__dirname, "./src/app/services"),
        "@/hooks": path.resolve(__dirname, "./src/app/hooks"),
        "@/contexts": path.resolve(__dirname, "./src/app/contexts"),
        "@/config": path.resolve(__dirname, "./src/app/config"),
        "@/libs": path.resolve(__dirname, "./src/app/libs"),
        "@/entities": path.resolve(__dirname, "./src/app/entities"),
        "@/storage": path.resolve(__dirname, "./src/app/storage"),
      },
    },
  })
);
