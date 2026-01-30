import { toCamelCase, toKebabCase, toPascalCase } from "../../../utils";

export function getControllerTemplate(
	moduleName: string,
	controllerName: string,
) {
	const pascal = toPascalCase(controllerName);
	const camel = toCamelCase(controllerName);
	const kebab = toKebabCase(controllerName);
	const moduleKebab = toKebabCase(moduleName);
	return `import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { I${pascal}Service } from "@application/modules/${moduleKebab}/services/${kebab}";
import { ${camel}Schema } from "./schema";

export class ${pascal}Controller implements IController {
	constructor(private readonly ${camel}Service: I${pascal}Service) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(${camel}Schema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.${camel}Service.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
`;
}
