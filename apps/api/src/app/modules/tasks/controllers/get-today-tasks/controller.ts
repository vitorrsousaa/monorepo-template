import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { todayProjectToDto } from "@application/modules/tasks/mappers/task-to-dto";
import type { IGetTodayTasksService } from "@application/modules/tasks/services/get-today-tasks";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { GetTodayTasksResponse } from "@repo/contracts/tasks/today";
import { getTodayTasksSchema } from "./schema";

export class GetTodayTasksController implements IController {
	constructor(private readonly getTodayTasksService: IGetTodayTasksService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getTodayTasksSchema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.getTodayTasksService.execute(parsedBody);
			const body: GetTodayTasksResponse = {
				projects: result.projects.map(todayProjectToDto),
			};

			return {
				statusCode: 200,
				body,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
