#!/usr/bin/env node
import { Command } from "commander";
import { addHandler } from "./commands/add";
import { createHandler } from "./commands/create/handler";

const program = new Command();

program
	.command("create")
	.description("Cria um novo módulo, controller, service ou provider")
	.action(createHandler);

program
	.command("add <component>")
	.description("Adiciona um componente do shadcn/ui ao pacote @repo/ui")
	.action(addHandler);

program.parse(process.argv);
