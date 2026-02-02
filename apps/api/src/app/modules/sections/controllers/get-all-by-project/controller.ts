import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IGetAllByProjectService } from "@application/modules/sections/services/get-all-by-project";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import { getAllByProjectSchema } from "./schema";

export class GetAllByProjectController implements IController {
	constructor(
		private readonly getAllByProjectService: IGetAllByProjectService,
	) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getAllByProjectSchema, {
				...request.body,
				userId: request.userId || "",
				projectId: (request.params.projectId as string) || "",
			});

			if (!status) return parsedBody;

			const result = await this.getAllByProjectService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
