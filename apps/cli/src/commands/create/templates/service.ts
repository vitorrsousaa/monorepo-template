import { toPascalCase } from "../../../utils";

export function getServiceTemplate(serviceName: string) {
	const pascal = toPascalCase(serviceName);
	return `import type { IService } from "@application/interfaces/service";
import type { ${pascal}Input, ${pascal}Output } from "./dto";

export interface I${pascal}Service extends IService<${pascal}Input, ${pascal}Output> {}

export class ${pascal}Service implements I${pascal}Service {
  constructor() {}

  async execute(data: ${pascal}Input): Promise<${pascal}Output> {
    return {
      success: true,
    };
  }
}
`;
}
