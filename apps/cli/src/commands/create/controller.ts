import * as fs from "fs-extra";
import * as path from "node:path";
import { getApiModulesPath } from "../../lib/paths";
import { toKebabCase } from "../../utils";
import {
	getControllerSchemaTemplate,
	getControllerTemplate,
} from "./templates";

export type CreateControllerOptions = { skipSuccessLog?: boolean };

export async function createController(
	moduleName: string,
	controllerName: string,
	options: CreateControllerOptions = {},
) {
	const { skipSuccessLog = false } = options;
	const targetDir = getApiModulesPath(__dirname);
	const moduleDir = path.join(targetDir, toKebabCase(moduleName));

	const moduleExists = fs.existsSync(moduleDir);
	if (!moduleExists) {
		console.log(`Module '${moduleName}' does not exist.`);
		return;
	}

	const controllerDir = path.join(
		moduleDir,
		"controllers",
		toKebabCase(controllerName),
	);

	const controllerAlreadyExists = fs.existsSync(controllerDir);

	if (controllerAlreadyExists) {
		console.log(`Controller '${controllerName}' already exists.`);
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

		if (!skipSuccessLog) {
			console.log("Controller created successfully!");
		}
	} catch (err) {
		console.error("Error creating controller:", err);
	}
}
