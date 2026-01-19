import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		minify: "esbuild",
		chunkSizeWarningLimit: 1000,
	},
	resolve: {
		alias: {
			"@/pages": path.resolve(__dirname, "./src/view/pages"),
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
			"@/modules": path.resolve(__dirname, "./src/modules"),
		},
		dedupe: ["react", "react-dom"],
	},
	optimizeDeps: {
		include: ["react", "react-dom"],
		exclude: [],
	},
});
