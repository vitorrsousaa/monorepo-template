import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/auth/**/*.ts",
		"src/tasks/**/*.ts",
		"src/projects/**/*.ts",
		"src/sections/**/*.ts",
		"src/common/index.ts",
		"src/enums/**.ts",
		"src/settings/**/*.ts",
		"src/**/**/*.ts",
	],
	format: ["esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
});
