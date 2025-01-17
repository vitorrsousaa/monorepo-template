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
				title: "Entity Name",
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
						content: (inputs) => `export * from "./entity";
`,
					},
					{
						type: "file",
						name: "entity.ts",
						content: (inputs) => `import { Prettify } from "@application/utils/types";
import { BaseEntity } from "@core/base";
import * as z from "zod";

export const ${toPascalCase(inputs.name)}Schema = z.object({
	name: z.string()
})

export type Create${toPascalCase(inputs.name)}Schema = z.infer<typeof ${toPascalCase(inputs.name)}Schema>

export type ${toPascalCase(inputs.name)} = Prettify<Create${toPascalCase(inputs.name)}Schema> & BaseEntity
`,
					},
				],
			},
		],
	};
});
