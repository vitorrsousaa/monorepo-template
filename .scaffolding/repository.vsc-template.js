(function Template() {
	const toPascalCase = (str) =>
		str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (fl) => fl.toUpperCase())
			.replace(/\W+/g, "");

	const toCamelCase = (str) =>
		toPascalCase(str).replace(/^./, (firstLetter) => firstLetter.toLowerCase());
	
	const toKebabCase = (str) => 
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''); 

	return {
		userInputs: [
			{
				title: "Repository Name",
				argumentName: "name",
				defaultValue: "Sample",
			},
		],
		template: [
			{
				type: "folder",
				name: (inputs) => `${toKebabCase(inputs.name)}`,
				children: [
					{
						type: "file",
						name: "index.ts",
						content: (inputs) => `export * from "./types";
export * from "./repository";
`,
					},
					{
						type: "file",
						name: "types.ts",
						content: (inputs) => `import { TBaseEntity } from "@application/database/entities";
import { Prettify } from "@application/utils/types";
import { ${toPascalCase(inputs.name)} } from "@core/domain/${toKebabCase(inputs.name)}";

export type ${toPascalCase(inputs.name)}DynamoDB = Prettify<
	{
		created_at: string;
		updated_at: string;
	} & TBaseEntity &
	  Omit<${toPascalCase(inputs.name)}, 'createdAt' | 'updatedAt'>
>;

export interface I${toPascalCase(inputs.name)}Repository {
	getAll(): Promise<${toPascalCase(inputs.name)}[]>;
}
`,
					},
					{
						type: "file",
						name: "repository.ts",
						content: (inputs) => `import { IDatabaseClient } from "@application/database/database";
import { TBaseEntity } from "@application/database/entities";
import { ${toPascalCase(inputs.name)} } from "@core/domain/${toKebabCase(inputs.name)}";
import { I${toPascalCase(inputs.name)}Repository, ${toPascalCase(inputs.name)}DynamoDB } from "./types";

export class ${toPascalCase(inputs.name)}Repository implements I${toPascalCase(inputs.name)}Repository {
	constructor(private readonly databaseClient: IDatabaseClient) {}
	
	getAll(): Promise<${toPascalCase(inputs.name)}[]> {
		throw new Error("Method not implemented.");
	}
		
	private maptoDomain(data: ${toPascalCase(inputs.name)}DynamoDB): ${toPascalCase(inputs.name)} {
		return {
			createdAt: data.created_at,
			updatedAt: data.updated_at,
			id: data.id
		}
	}
		
	private getKeys(id: string): TBaseEntity {
		return {
			PK: 'ENTITY',
			SK: 'ENTITY',
		}
	}
		
	private mapToDynamoDB(data: ${toPascalCase(inputs.name)}): ${toPascalCase(inputs.name)}DynamoDB {
		const { PK, SK } = this.getKeys(data.id);
	
		return {
			PK, 
			SK,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
			id: data.id
		}
	}

}
`,
					},
				],
			},
		],
	};
});
