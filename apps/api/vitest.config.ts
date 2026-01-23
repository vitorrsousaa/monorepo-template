import path from "node:path";
// @ts-ignore
import configShared from "@repo/vitest-presets/node/vitest.config.js";
import { defineProject, mergeConfig } from "vitest/config";

export default mergeConfig(
	configShared,
	defineProject({
		test: {
			globals: true,
		},
		resolve: {
			alias: {
				"@/config": path.resolve(__dirname, "./src/app/config"),
				"@/errors": path.resolve(__dirname, "./src/app/errors"),
				"@/interfaces": path.resolve(__dirname, "./src/app/interfaces"),
				"@/providers": path.resolve(__dirname, "./src/app/providers"),
				"@/shared": path.resolve(__dirname, "./src/app/shared"),
				"@/utils": path.resolve(__dirname, "./src/app/utils"),
			},
		},
	}),
);
