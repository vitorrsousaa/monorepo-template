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
			message: "O que você deseja criar?",
			choices: ["module", "controller", "service", "provider"],
		},
		{
			type: "input",
			name: "name",
			message: "Qual o nome do recurso que você deseja criar?",
			validate: (input: string) =>
				input.length > 0 ? true : "O nome do recurso não pode ser vazio.",
		},
	]);

	if (type === "module") {
		const { serviceName } = await inquirer.prompt([
			{
				type: "input",
				name: "serviceName",
				message: "Qual o nome do service default?",
				validate: (input: string) =>
					input.length > 0 ? true : "O nome do service não pode ser vazio.",
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
				message: "Qual o nome do módulo onde o controller será inserido?",
				validate: (input: string) =>
					input.length > 0 ? true : "O nome do módulo não pode ser vazio.",
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
				message: "Qual o nome do módulo onde o service será inserido?",
				validate: (input: string) =>
					input.length > 0 ? true : "O nome do módulo não pode ser vazio.",
			},
		]);
		await createService(moduleName, name);
		return;
	}

	if (type === "provider") {
		await createProvider(name);
	}
}
