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
				title: "Service Name",
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
						content: (inputs) => `export * from "./service";
`,
					},
					{
						type: "file",
						name: "service.ts",
						content: (inputs) => `import type { IService } from "@application/interfaces/service";
import * as z from 'zod';

export const ${toPascalCase(inputs.name)}InputServiceSchema = z.object({
  userId: z.string().uuid(),
});

export type T${toPascalCase(inputs.name)} = z.infer<typeof ${toPascalCase(
							inputs.name,
						)}InputServiceSchema>;

export type I${toPascalCase(inputs.name)}Input = T${toPascalCase(inputs.name)};

export type I${toPascalCase(inputs.name)}Output = {
  name: string;
}

export type I${toPascalCase(inputs.name)}Service = IService<I${toPascalCase(
							inputs.name,
						)}Input, I${toPascalCase(inputs.name)}Output>;

export class ${toPascalCase(inputs.name)}Service implements I${toPascalCase(
							inputs.name,
						)}Service {
  constructor() {}

  async execute(${toCamelCase(inputs.name)}Input: I${toPascalCase(
		inputs.name,
	)}Input): Promise<I${toPascalCase(inputs.name)}Output> {
    return {
      name: ${toCamelCase(inputs.name)}Input.name,
    };
  }
}
`,
					},
				],
			},
		],
	};
});
