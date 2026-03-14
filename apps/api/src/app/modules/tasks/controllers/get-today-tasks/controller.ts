import { Controller } from "@application/interfaces/controller";
import { todayProjectToDto } from "@application/modules/tasks/mappers/task-to-dto";
import type { IGetTodayTasksService } from "@application/modules/tasks/services/get-today-tasks";
import type { GetTodayTasksResponse } from "@repo/contracts/tasks/today";

export class GetTodayTasksController extends Controller<
	"private",
	GetTodayTasksResponse
> {
	constructor(private readonly getTodayTasksService: IGetTodayTasksService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<GetTodayTasksResponse>> {
		const result = await this.getTodayTasksService.execute({
			userId: request.userId,
		});
		const body: GetTodayTasksResponse = {
			projects: result.projects.map(todayProjectToDto),
		};
		return {
			statusCode: 200,
			body,
		};
	}
}
