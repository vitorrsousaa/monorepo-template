import { toKebabCase } from "@/utils";

export function getControllerTemplate(input: string) {
	return `import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { IAuthenticationMiddleware } from "@application/shared/middlewares/authentication";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";

export class ${toKebabCase(input)}Controller implements IController {
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
`;
}
