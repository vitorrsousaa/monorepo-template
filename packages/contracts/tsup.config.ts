import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/auth/**/*.ts",
		"src/todo/index.ts",
		"src/todo/inbox/index.ts",
		"src/todo/create/index.ts",
		"src/tasks/dto.ts",
		"src/tasks/**/*.ts",
		"src/tasks/index.ts",
		"src/projects/index.ts",
		"src/common/index.ts",
	],
	format: ["esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
});
