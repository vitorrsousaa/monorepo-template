#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { createModule } from "./commands/create/module";

async function create(moduleName: string) {
	const { type, name } = await inquirer.prompt([
		{
			type: "list",
			name: "type",
			message: "O que você deseja criar?",
			choices: ["module", "controller", "service"],
		},
		{
			type: "input",
			name: "name",
			message: "Qual o nome do módulo?",
			validate: (input: string) =>
				input.length > 0 ? true : "O nome do módulo não pode ser vazio.",
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
}

const program = new Command();

program
	.command("create")
	.description("Cria um novo módulo com um arquivo TypeScript")
	.action(create);

program.parse(process.argv);
