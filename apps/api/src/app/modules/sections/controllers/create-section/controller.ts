import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { ICreateSectionService } from "@application/modules/sections/services/create-section";
import { createSectionSchema } from "./schema";

export class CreateSectionController implements IController {
	constructor(private readonly createSectionService: ICreateSectionService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(createSectionSchema, {
				...request.body,
				userId: request.userId || "",
				projectId: (request.params.projectId as string) || "",
			});

			if (!status) return parsedBody;

			const result = await this.createSectionService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
