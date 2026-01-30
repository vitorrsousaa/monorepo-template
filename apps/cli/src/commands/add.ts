import { spawn } from "node:child_process";
import * as path from "node:path";

/**
 * Adiciona um componente do shadcn/ui ao pacote @repo/ui.
 * A CLI roda a partir de apps/cli/dist, então subimos para o monorepo e entramos em packages/ui.
 */
export async function addHandler(componentName: string): Promise<void> {
	const uiPackagePath = path.resolve(__dirname, "../../../packages/ui");

	console.log(
		`Executando: npx shadcn@latest add ${componentName} em ${uiPackagePath}...\n`,
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
			console.error(`Erro ao executar shadcn: ${error.message}`);
			reject(error);
		});

		shadcnProcess.on("exit", (code) => {
			if (code !== 0) {
				reject(new Error(`Processo falhou com código ${code}`));
			} else {
				resolve();
			}
		});
	});
}
