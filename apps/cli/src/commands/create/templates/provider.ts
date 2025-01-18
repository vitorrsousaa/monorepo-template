import { toPascalCase } from "../../../utils";

const index = `export * from "./provider";
export * from "./types";`;

const getMainFile = (
	providerName: string,
) => `import type { IConfig } from "@application/config/environment";

import type { I${toPascalCase(providerName)}Provider } from "./types";

export class ${toPascalCase(providerName)}Provider implements I${toPascalCase(providerName)}Provider {
	constructor(private readonly config: IConfig) {}

	handle(id: string) {
		return id;
	}
}
`;

const getTypeFile = (
	providerName: string,
) => `export interface I${toPascalCase(providerName)}Provider {
	handle(id: string): string;
}`;

export function getProviderTemplate(providerName: string) {
	const provider = {
		index,
		main: getMainFile(providerName),
		types: getTypeFile(providerName),
	};

	return provider;
}
