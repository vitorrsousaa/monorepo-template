import { toCamelCase, toPascalCase } from "../../../utils";

export function getServiceTemplate(input: string) {
	return `import type { IService } from "@application/interfaces/service";
import * as z from 'zod';

export const ${toPascalCase(input)}InputServiceSchema = z.object({
  userId: z.string().uuid(),
});

export type T${toPascalCase(input)} = z.infer<typeof ${toPascalCase(
		input,
	)}InputServiceSchema>;

export type I${toPascalCase(input)}Input = T${toPascalCase(input)};

export type I${toPascalCase(input)}Output = {
  name: string;
}

export type I${toPascalCase(input)}Service = IService<I${toPascalCase(
		input,
	)}Input, I${toPascalCase(input)}Output>;

export class ${toPascalCase(input)}Service implements I${toPascalCase(
		input,
	)}Service {
  constructor() {}

  async execute(${toCamelCase(input)}Input: I${toPascalCase(
		input,
	)}Input): Promise<I${toPascalCase(input)}Output> {
    return {
      name: ${toCamelCase(input)}Input.name,
    };
  }
}
`;
}
