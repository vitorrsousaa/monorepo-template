import * as fs from "fs-extra";
import * as path from "node:path";
import { getApiModulesPath } from "../../lib/paths";
import { toKebabCase } from "../../utils";
import { getDtoTemplate, getServiceTemplate } from "./templates";

export type CreateServiceOptions = { skipSuccessLog?: boolean };

export async function createService(
	moduleName: string,
	serviceName: string,
	options: CreateServiceOptions = {},
) {
	const { skipSuccessLog = false } = options;
	const targetDir = getApiModulesPath(__dirname);
	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	const moduleExists = fs.existsSync(moduleDir);
	if (!moduleExists) {
		console.log(`Module '${moduleName}' does not exist.`);
		return;
	}

	const serviceDir = path.join(moduleDir, "services", toKebabCase(serviceName));

	const serviceAlreadyExists = fs.existsSync(serviceDir);

	if (serviceAlreadyExists) {
		console.log(`Service '${serviceName}' already exists.`);
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

		if (!skipSuccessLog) {
			console.log("Service created successfully!");
		}
	} catch (err) {
		console.error("Error creating service:", err);
	}
}
