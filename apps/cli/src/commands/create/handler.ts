import inquirer from "inquirer";
import { createController } from "./controller";
import { createModule } from "./module";
import { createProvider } from "./provider";
import { createService } from "./service";

export async function createHandler() {
	const { type, name } = await inquirer.prompt([
		{
			type: "list",
			name: "type",
			message: "What do you want to create?",
			choices: ["module", "controller", "service", "provider"],
		},
		{
			type: "input",
			name: "name",
			message: "What is the name of the resource you want to create?",
			validate: (input: string) =>
				input.length > 0 ? true : "Resource name cannot be empty.",
		},
	]);

	if (type === "module") {
		const { serviceName } = await inquirer.prompt([
			{
				type: "input",
				name: "serviceName",
				message: "What is the name of the default service?",
				validate: (input: string) =>
					input.length > 0 ? true : "Service name cannot be empty.",
			},
		]);
		await createModule(name, serviceName);
		return;
	}

	if (type === "controller") {
		const { moduleName } = await inquirer.prompt([
			{
				type: "input",
				name: "moduleName",
				message:
					"What is the name of the module where the controller will be added?",
				validate: (input: string) =>
					input.length > 0 ? true : "Module name cannot be empty.",
			},
		]);
		await createController(moduleName, name);
		return;
	}

	if (type === "service") {
		const { moduleName } = await inquirer.prompt([
			{
				type: "input",
				name: "moduleName",
				message:
					"What is the name of the module where the service will be added?",
				validate: (input: string) =>
					input.length > 0 ? true : "Module name cannot be empty.",
			},
		]);
		await createService(moduleName, name);
		return;
	}

	if (type === "provider") {
		await createProvider(name);
	}
}
