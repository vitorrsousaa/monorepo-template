import * as fs from "fs-extra";
import * as path from "node:path";
import { toKebabCase } from "../../utils";
import { getServiceTemplate } from "./templates/service";

export async function createService(moduleName: string, serviceName: string) {
	const targetDir = path.resolve(__dirname, "../../../../api/src/app/modules");

	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	const moduleExists = fs.existsSync(moduleDir);
	if (!moduleExists) {
		console.log(`O módulo '${moduleName}' nao existe.`);
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

		const serviceFile = path.join(serviceDir, "service.ts");
		const indexServiceFile = path.join(serviceDir, "index.ts");

		await fs.outputFile(indexServiceFile, `export * from "./service";`);
		await fs.outputFile(serviceFile, getServiceTemplate(moduleName));

		console.log("Service create with successfull!");
	} catch (err) {
		console.error("Erro ao criar o módulo:", err);
	}
}
