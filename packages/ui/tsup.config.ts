import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/components/**/*.tsx",
		"src/utils/index.ts",
		"src/providers/index.ts",
		"src/others/index.ts",
	],
	format: ["esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	esbuildOptions(options) {
		options.alias = {
			...(options.alias || {}),
			"@": path.resolve(__dirname, "src"),
		};
	},
	external: ["react", "react-dom"],
});
