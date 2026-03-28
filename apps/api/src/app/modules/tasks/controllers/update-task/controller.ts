import { Controller } from "@application/interfaces/controller";
import type { ITaskParams } from "@application/interfaces/params";
import type { IUpdateTaskService } from "@application/modules/tasks/services/update-task";
import type {
	UpdateTaskInput,
	UpdateTaskOutput,
} from "@repo/contracts/tasks/update";
import { updateTaskSchema } from "@repo/contracts/tasks/update";

export class UpdateTaskController extends Controller<
	"private",
	UpdateTaskOutput,
	UpdateTaskInput,
	ITaskParams
> {
	constructor(private readonly service: IUpdateTaskService) {
		super();
	}

	protected override schema = updateTaskSchema;

	protected override async handle(
		request: Controller.Request<"private", UpdateTaskInput, ITaskParams>,
	): Promise<Controller.Response<UpdateTaskOutput>> {
		const result = await this.service.execute({
			taskId: request.params.taskId,
			userId: request.userId,
			...request.body,
		});

		return {
			statusCode: 200,
			body: { task: result.task },
		};
	}
}
