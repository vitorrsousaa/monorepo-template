import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { ICreateProjectService } from "@application/modules/projects/services/create-project";
import { createProjectSchema } from "./schema";

export class CreateProjectController implements IController {
	constructor(private readonly createProjectService: ICreateProjectService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(createProjectSchema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.createProjectService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
