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
				title: "Controller Name",
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
						content: (inputs) => `export * from "./controller";
`,
					},
					{
						type: "file",
						name: "controller.ts",
						content: (inputs) => `import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { IAuthenticationMiddleware } from "@application/shared/middlewares/authentication";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";

export class ${toPascalCase(inputs.name)}Controller implements IController {
  constructor(private readonly authenticationMiddleware: IAuthenticationMiddleware) {}
  async handle(request: IRequest): Promise<IResponse> {
    try {
			const { userId } = await this.authenticationMiddleware.handle(request)
      const [status, parsedBody] = missingFields(Schema, { ...request.body, userId });
      
			if (!status) return parsedBody;

      const service = await this.service.execute(parsedBody)
      
			return {
				statusCode: 200,
				body: service
			};
    } catch (error) {
      return errorHandler(error);
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
