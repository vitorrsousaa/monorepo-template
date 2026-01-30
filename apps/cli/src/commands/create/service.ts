import * as fs from "fs-extra";
import * as path from "node:path";
import { getApiModulesPath } from "../../lib/paths";
import { toKebabCase } from "../../utils";
import { getDtoTemplate, getServiceTemplate } from "./templates";

export async function createService(moduleName: string, serviceName: string) {
	const targetDir = getApiModulesPath(__dirname);
	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	console.log(moduleDir);

	const moduleExists = fs.existsSync(moduleDir);
	if (!moduleExists) {
		console.log(`O módulo '${moduleName}' não existe.`);
		return;
	}

	const serviceDir = path.join(moduleDir, "services", toKebabCase(serviceName));

	const serviceAlreadyExists = fs.existsSync(serviceDir);

	if (serviceAlreadyExists) {
		console.log(`O service '${serviceName}' já existe.`);
		return;
	}

	try {
		await fs.ensureDir(serviceDir);

		const dtoFile = path.join(serviceDir, "dto.ts");
		const serviceFile = path.join(serviceDir, "service.ts");
		const indexFile = path.join(serviceDir, "index.ts");

		await fs.outputFile(dtoFile, getDtoTemplate(serviceName));
		await fs.outputFile(serviceFile, getServiceTemplate(serviceName));
		await fs.outputFile(indexFile, `export * from "./service";\n`);

		console.log("Service criado com sucesso!");
	} catch (err) {
		console.error("Erro ao criar o service:", err);
	}
}
