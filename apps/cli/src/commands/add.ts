import { spawn } from "node:child_process";
import * as path from "node:path";

/**
 * Adds a shadcn/ui component to the @repo/ui package.
 * CLI runs from apps/cli/dist, so we go up to monorepo root and into packages/ui.
 */
export async function addHandler(componentName: string): Promise<void> {
	const uiPackagePath = path.resolve(__dirname, "../../../packages/ui");

	console.log(
		`Running: npx shadcn@latest add ${componentName} in ${uiPackagePath}...\n`,
	);

	return new Promise((resolve, reject) => {
		const shadcnProcess = spawn(
			"npx",
			["shadcn@latest", "add", componentName],
			{
				stdio: "inherit",
				cwd: uiPackagePath,
				shell: true,
			},
		);

		shadcnProcess.on("error", (error) => {
			console.error(`Error running shadcn: ${error.message}`);
			reject(error);
		});

		shadcnProcess.on("exit", (code) => {
			if (code !== 0) {
				reject(new Error(`Process failed with exit code ${code}`));
			} else {
				resolve();
			}
		});
	});
}
