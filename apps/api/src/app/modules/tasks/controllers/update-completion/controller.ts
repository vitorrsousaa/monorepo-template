import { Controller } from "@application/interfaces/controller";
import type { ITaskParams } from "@application/interfaces/params";
import type { IUpdateTaskCompletionService } from "@application/modules/tasks/services/update-completion";
import type {
	UpdateTaskCompletionInput,
	UpdateTaskCompletionOutput,
} from "@repo/contracts/tasks/completion";
import { updateTaskCompletionSchema } from "@repo/contracts/tasks/completion";

export class UpdateTaskCompletionController extends Controller<
	"private",
	UpdateTaskCompletionOutput,
	UpdateTaskCompletionInput,
	ITaskParams
> {
	constructor(
		private readonly updateTaskCompletionService: IUpdateTaskCompletionService,
	) {
		super();
	}

	protected override schema = updateTaskCompletionSchema;

	protected override async handle(
		request: Controller.Request<"private", UpdateTaskCompletionInput, ITaskParams>,
	): Promise<Controller.Response<UpdateTaskCompletionOutput>> {
		const result = await this.updateTaskCompletionService.execute({
			userId: request.userId,
			taskId: request.params.taskId,
			projectId: request.body.projectId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
