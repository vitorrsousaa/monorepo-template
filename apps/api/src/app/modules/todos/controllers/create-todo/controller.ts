import { Controller } from "@application/interfaces/controller";
import { todoToDto } from "@application/modules/todos/mappers/todo-to-dto";
import type { ICreateTodoService } from "@application/modules/todos/services/create-todo";
import type { CreateTodoResponse } from "@repo/contracts/todo/create";
import { createTodoSchema, type CreateTodoSchema } from "./schema";

export class CreateTodoController extends Controller<
	"private",
	CreateTodoResponse
> {
	constructor(private readonly createTodoService: ICreateTodoService) {
		super();
	}

	protected override schema = createTodoSchema;

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<CreateTodoResponse>> {
		const body = request.body as CreateTodoSchema;
		const service = await this.createTodoService.execute({
			...body,
			userId: request.userId,
		});
		return {
			statusCode: 201,
			body: {
				todo: todoToDto(service.todo),
			},
		};
	}
}
