import { Controller } from "@application/interfaces/controller";
import { todoToDto } from "@application/modules/todos/mappers/todo-to-dto";
import type { IGetInboxTodosService } from "@application/modules/todos/services/get-inbox-todos";
import type { GetInboxTodosResponse } from "@repo/contracts/todo/inbox";

export class GetInboxTodosController extends Controller<"private", GetInboxTodosResponse> {
	constructor(private readonly getInboxTodosService: IGetInboxTodosService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<GetInboxTodosResponse>> {
		const result = await this.getInboxTodosService.execute({
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: {
				todos: result.todos.map(todoToDto),
				total: result.total,
			},
		};
	}
}
