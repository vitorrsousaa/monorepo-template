import * as fs from "fs-extra";
import * as path from "node:path";
import { getApiModulesPath } from "../../lib/paths";
import { toKebabCase } from "../../utils";
import { getControllerTemplate, getServiceTemplate } from "./templates";

export async function createModule(moduleName: string, serviceName: string) {
	const targetDir = getApiModulesPath(__dirname);
	const moduleDir = path.join(targetDir, toKebabCase(moduleName));
	if (fs.existsSync(moduleDir)) {
		console.log(`O módulo '${moduleName}' já existe.`);
		return;
	}

	try {
		// create all directories
		await fs.ensureDir(moduleDir);

		const controllersDir = path.join(moduleDir, "controllers");
		await fs.ensureDir(controllersDir);
		const servicesDir = path.join(moduleDir, "services");
		await fs.ensureDir(servicesDir);

		// create all subdirectories
		const servicesSubDir = path.join(servicesDir, toKebabCase(serviceName));
		await fs.ensureDir(servicesSubDir);

		const controllersSubDir = path.join(
			controllersDir,
			toKebabCase(serviceName),
		);
		await fs.ensureDir(controllersSubDir);

		// create all files
		const controllerFile = path.join(controllersSubDir, "controller.ts");
		const indexControllerFile = path.join(controllersSubDir, "index.ts");

		const serviceFile = path.join(servicesSubDir, "service.ts");
		const indexServiceFile = path.join(servicesSubDir, "index.ts");

		// Add content for files
		await fs.outputFile(indexControllerFile, `export * from "./controller";`);
		await fs.outputFile(
			controllerFile,
			getControllerTemplate(moduleName, serviceName),
		);

		await fs.outputFile(serviceFile, getServiceTemplate(serviceName));
		await fs.outputFile(indexServiceFile, `export * from "./service";`);
	} catch (err) {
		console.error("Erro ao criar o módulo:", err);
	}
}
