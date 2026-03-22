import { Controller } from "@application/interfaces/controller";
import type {
	CreateTaskInput,
	CreateTaskOutput,
} from "@repo/contracts/tasks/create";
import { createTaskSchema } from "@repo/contracts/tasks/create";
import type { ICreateTasksService } from "../../services/create";

export class CreateTasksController extends Controller<
	"private",
	CreateTaskOutput
> {
	constructor(private readonly createTaskService: ICreateTasksService) {
		super();
	}

	protected override schema = createTaskSchema;

	protected override async handle(
		request: Controller.Request<"private", CreateTaskInput>,
	): Promise<Controller.Response<CreateTaskOutput>> {
		const result = await this.createTaskService.execute({
			userId: request.userId,
			...request.body,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
