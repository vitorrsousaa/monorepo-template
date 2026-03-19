import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/auth/**/*.ts",
		"src/todo/index.ts",
		"src/todo/inbox/index.ts",
		"src/todo/create/index.ts",
		"src/tasks/**/*.ts",
		"src/projects/**/*.ts",
		"src/sections/**/*.ts",
		"src/common/index.ts",
	],
	format: ["esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
});
