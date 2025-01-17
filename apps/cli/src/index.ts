#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs-extra";
import path from "node:path";

// Função para gerar os arquivos TypeScript
async function createModuleFile(moduleName: string) {
	const targetDir = path.resolve(__dirname, "../apps/api/module");

	// Verificando se o diretório 'module' existe dentro do api
	const moduleDir = path.join(targetDir, moduleName);
	if (fs.existsSync(moduleDir)) {
		console.log(`O módulo '${moduleName}' já existe.`);
		return;
	}

	try {
		// Criação do diretório do módulo (caso não exista)
		await fs.ensureDir(moduleDir);

		// Criação do arquivo TypeScript
		const filePath = path.join(moduleDir, `${moduleName}.ts`);
		const fileContent = `
      // Arquivo gerado automaticamente para o módulo ${moduleName}
      export const ${moduleName} = () => {
        console.log('Módulo ${moduleName} criado com sucesso!');
      };
    `;
		await fs.outputFile(filePath, fileContent);

		console.log(
			`Módulo '${moduleName}' criado com sucesso! Arquivo em: ${filePath}`,
		);
	} catch (err) {
		console.error("Erro ao criar o módulo:", err);
	}
}

// Configuração da CLI com o Commander
const program = new Command();

program
	.command("create <moduleName>")
	.description("Cria um novo módulo com um arquivo TypeScript")
	.action(createModuleFile);

program.parse(process.argv);
