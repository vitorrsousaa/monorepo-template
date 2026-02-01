import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { IGetProjectDetailService } from "@application/modules/projects/services/get-project-detail";
import { getProjectDetailSchema } from "./schema";

export class GetProjectDetailController implements IController {
	constructor(
		private readonly getProjectDetailService: IGetProjectDetailService,
	) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getProjectDetailSchema, {
				userId: request.userId || "",
				projectId: (request.params.projectId as string) || "",
			});

			if (!status) return parsedBody;

			const result = await this.getProjectDetailService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
