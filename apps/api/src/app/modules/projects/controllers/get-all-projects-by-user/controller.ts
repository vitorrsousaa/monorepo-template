import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { IGetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
import { getAllProjectsByUserSchema } from "./schema";

export class GetAllProjectsByUserController implements IController {
	constructor(
		private readonly getAllProjectsByUserService: IGetAllProjectsByUserService,
	) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getAllProjectsByUserSchema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.getAllProjectsByUserService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
