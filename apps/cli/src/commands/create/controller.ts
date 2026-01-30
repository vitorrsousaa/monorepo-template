import * as fs from "fs-extra";
import * as path from "node:path";
import { toKebabCase } from "../../utils";
import { getControllerTemplate } from "./templates/controller";
import { getControllerSchemaTemplate } from "./templates/controller-schema";

export async function createController(
	moduleName: string,
	controllerName: string,
) {
	const targetDir = path.resolve(
		__dirname,
		"../../../apps/api/src/app/modules",
	);

	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	const moduleExists = fs.existsSync(moduleDir);
	if (!moduleExists) {
		console.log(`O módulo '${moduleName}' não existe.`);
		return;
	}

	const controllerDir = path.join(
		moduleDir,
		"controllers",
		toKebabCase(controllerName),
	);

	const controllerAlreadyExists = fs.existsSync(controllerDir);

	if (controllerAlreadyExists) {
		console.log(`O controller '${controllerName}' já existe.`);
		return;
	}

	try {
		await fs.ensureDir(controllerDir);

		const controllerFile = path.join(controllerDir, "controller.ts");
		const schemaFile = path.join(controllerDir, "schema.ts");
		const indexFile = path.join(controllerDir, "index.ts");

		await fs.outputFile(
			controllerFile,
			getControllerTemplate(moduleName, controllerName),
		);
		await fs.outputFile(
			schemaFile,
			getControllerSchemaTemplate(moduleName, controllerName),
		);
		await fs.outputFile(indexFile, `export * from "./controller";\n`);

		console.log("Controller criado com sucesso!");
	} catch (err) {
		console.error("Erro ao criar o controller:", err);
	}
}
