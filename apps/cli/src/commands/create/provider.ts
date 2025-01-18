import * as fs from "fs-extra";
import * as path from "node:path";
import { toKebabCase } from "../../utils";
import { getProviderTemplate } from "./templates/provider";

export async function createProvider(providerName: string) {
	const targetDir = path.resolve(
		__dirname,
		"../../../../api/src/app/providers",
	);

	const providerDir = path.join(targetDir, toKebabCase(providerName));

	const providerAlreadyExists = fs.existsSync(providerDir);

	if (providerAlreadyExists) {
		console.log(`O provider '${providerName}' já existe.`);
		return;
	}

	try {
		await fs.ensureDir(providerDir);

		const providerFile = path.join(providerDir, "provider.ts");
		const indexProviderFile = path.join(providerDir, "index.ts");
		const providerTypefile = path.join(providerDir, "types.ts");

		const providerOutput = getProviderTemplate(providerName);

		await fs.outputFile(providerFile, providerOutput.main);
		await fs.outputFile(indexProviderFile, providerOutput.index);
		await fs.outputFile(providerTypefile, providerOutput.types);

		console.log("Provider created with successful");
	} catch (err) {
		console.error("Erro ao criar o provider:", err);
	}
}
