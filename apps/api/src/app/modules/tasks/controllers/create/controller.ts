import { Controller } from "@application/interfaces/controller";
import type {
	CreateTaskInputDto,
	CreateTaskResponse,
} from "@repo/contracts/tasks/create";
import { createTaskSchema } from "@repo/contracts/tasks/create";
import { ICreateTasksService } from "../../services/create";

export class CreateTasksController extends Controller<
	"private",
	CreateTaskResponse
> {
	constructor(private readonly createTaskService: ICreateTasksService) {
		super();
	}

	protected override schema = createTaskSchema;

	protected override async handle(
		request: Controller.Request<"private", CreateTaskInputDto>,
	): Promise<Controller.Response<CreateTaskResponse>> {
		const result = await this.createTaskService.execute({
			userId: request.userId,
			title: "Task de teste",
			description: "Descrição da task de teste",
			priority: "medium",
			dueDate: null,
			projectId: null,
			sectionId: null,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
