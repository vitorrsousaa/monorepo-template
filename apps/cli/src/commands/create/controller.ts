import * as fs from "fs-extra";
import * as path from "node:path";
import { toKebabCase } from "../../utils";
import { getControllerTemplate } from "./templates/controller";

export async function createController(
	moduleName: string,
	controllerName: string,
) {
	const targetDir = path.resolve(
		__dirname,
		"../../../../../apps/api/src/app/modules",
	);

	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	const moduleExists = fs.existsSync(moduleDir);
	if (!moduleExists) {
		console.log(`O módulo '${moduleName}' nao existe.`);
		return;
	}

	const controllerDir = path.join(
		moduleDir,
		"controllers",
		toKebabCase(controllerName),
	);

	const constrollerAlreadyExists = fs.existsSync(controllerDir);

	if (constrollerAlreadyExists) {
		console.log(`O controller '${controllerName}' já existe.`);
		return;
	}

	try {
		await fs.ensureDir(controllerDir);

		const controllerFile = path.join(controllerDir, "controller.ts");
		const indexControllerFile = path.join(controllerDir, "index.ts");

		await fs.outputFile(indexControllerFile, `export * from "./controller";`);
		await fs.outputFile(controllerFile, getControllerTemplate(moduleName));

		console.log("Controller create with successfull!");
	} catch (err) {
		console.error("Erro ao criar o módulo:", err);
	}
}
