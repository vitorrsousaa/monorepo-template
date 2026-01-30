import * as fs from "fs-extra";
import * as path from "node:path";
import { getApiProvidersPath } from "../../lib/paths";
import { toKebabCase } from "../../utils";
import { getProviderTemplate } from "./templates";

export async function createProvider(providerName: string) {
	const targetDir = getApiProvidersPath(__dirname);
	const providerDir = path.join(targetDir, toKebabCase(providerName));

	const providerAlreadyExists = fs.existsSync(providerDir);

	if (providerAlreadyExists) {
		console.log(`Provider '${providerName}' already exists.`);
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

		console.log("Provider created successfully!");
	} catch (err) {
		console.error("Error creating provider:", err);
	}
}
