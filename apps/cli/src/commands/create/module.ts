import * as fs from "fs-extra";
import * as path from "node:path";
import { getApiModulesPath } from "../../lib/paths";
import { toKebabCase } from "../../utils";
import { createController } from "./controller";
import { createService } from "./service";

export async function createModule(moduleName: string, serviceName: string) {
	const targetDir = getApiModulesPath(__dirname);
	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	if (fs.existsSync(moduleDir)) {
		console.log(`O módulo '${moduleName}' já existe.`);
		return;
	}

	try {
		await fs.ensureDir(moduleDir);
		await fs.ensureDir(path.join(moduleDir, "controllers"));
		await fs.ensureDir(path.join(moduleDir, "services"));

		const opts = { skipSuccessLog: true };
		await createService(moduleName, serviceName, opts);
		await createController(moduleName, serviceName, opts);

		console.log("Módulo criado com sucesso!");
	} catch (err) {
		console.error("Erro ao criar o módulo:", err);
	}
}
