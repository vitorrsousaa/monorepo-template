import { toPascalCase } from "../../../utils";
import { z } from "zod";

export function getDtoTemplate(serviceName: string) {
	const pascal = toPascalCase(serviceName);
	return `import { z } from "zod";

export const ${pascal}InputDTO = z.object({
  userId: z.string().uuid(),
});

export type ${pascal}Input = z.infer<typeof ${pascal}InputDTO>;

export interface ${pascal}Output {
  success: boolean;
}
`;
}
