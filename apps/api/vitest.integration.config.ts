import path from "node:path";
// @ts-ignore
import configShared from "@repo/vitest-presets/node/vitest.config.js";
import { defineProject, mergeConfig } from "vitest/config";

export default mergeConfig(
	configShared,
	defineProject({
		test: {
			globals: true,
			include: ["src/**/*.integration.test.ts"],
			setupFiles: ["src/test/setup-integration.ts"],
			testTimeout: 10_000,
		},
		resolve: {
			alias: {
				"@application": path.resolve(__dirname, "./src/app"),
				"@server": path.resolve(__dirname, "./src/server"),
				"@core": path.resolve(__dirname, "./src/core"),
				"@factories": path.resolve(__dirname, "./src/factories"),
				"@data": path.resolve(__dirname, "./src/data"),
				"@infra": path.resolve(__dirname, "./src/infra"),
				"@test": path.resolve(__dirname, "./src/test"),
			},
		},
	}),
);
