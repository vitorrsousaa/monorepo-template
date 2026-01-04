#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { spawn } from "node:child_process";
import * as path from "node:path";
import { createController } from "./commands/create/controller";
import { createModule } from "./commands/create/module";
import { createProvider } from "./commands/create/provider";
import { createService } from "./commands/create/service";

async function create(moduleName: string) {
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
			message: "Qual o nome do recurso que voce deseja criar?",
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
				message: "Qual o nome do module que o controller vai ser inserido?",
				validate: (input: string) =>
					input.length > 0 ? true : "O nome do service não pode ser vazio.",
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
				message: "Qual o nome do module que o service vai ser inserido?",
				validate: (input: string) =>
					input.length > 0 ? true : "O nome do service não pode ser vazio.",
			},
		]);

		await createService(moduleName, name);
		return;
	}

	if (type === "provider") {
		await createProvider(name);

		return;
	}
}

async function add(componentName: string) {
	// Calcula o caminho para packages/ui a partir do diretório da CLI
	// Quando compilado, o arquivo estará em apps/cli/dist/index.js
	// Então precisamos ir para ../../packages/ui
	const uiPackagePath = path.resolve(__dirname, "../../../packages/ui");

	console.log("changing folder to", uiPackagePath);
	console.log(
		`Executando: npx shadcn@latest add ${componentName} em ${uiPackagePath}...\n`,
	);

	return new Promise<void>((resolve, reject) => {
		const shadcnProcess = spawn(
			"npx",
			["shadcn@latest", "add", componentName],
			{
				stdio: "inherit",
				shell: true,
				cwd: uiPackagePath,
			},
		);

		shadcnProcess.on("error", (error) => {
			console.error(`Erro ao executar shadcn: ${error.message}`);
			reject(error);
		});

		shadcnProcess.on("exit", (code) => {
			if (code !== 0) {
				console.error(`shadcn falhou com código de saída ${code}`);
				reject(new Error(`Processo falhou com código ${code}`));
			} else {
				resolve();
			}
		});
	});
}

const program = new Command();

program
	.command("create")
	.description("Cria um novo módulo com um arquivo TypeScript")
	.action(create);

program
	.command("add <component>")
	.description("Adiciona um componente do shadcn/ui")
	.action(add);

program.parse(process.argv);
