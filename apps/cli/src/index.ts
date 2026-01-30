#!/usr/bin/env node
import { Command } from "commander";
import { addHandler } from "./commands/add";
import { createHandler } from "./commands/create/handler";

const program = new Command();

program
	.command("create")
	.description("Create a new module, controller, service or provider")
	.action(createHandler);

program
	.command("add <component>")
	.description("Add a shadcn/ui component to the @repo/ui package")
	.action(addHandler);

program.parse(process.argv);
