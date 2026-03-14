import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { todoToDto } from "@application/modules/todos/mappers/todo-to-dto";
import type { IGetInboxTodosService } from "@application/modules/todos/services/get-inbox-todos";
import type { GetInboxTodosResponse } from "@repo/contracts/todo/inbox";

export class GetInboxTodosController extends Controller {
	constructor(private readonly getInboxTodosService: IGetInboxTodosService) {
		super();
	}

	protected override async handle(request: IRequest): Promise<IResponse> {
		const result = await this.getInboxTodosService.execute({
			userId: request.userId ?? "",
		});
		const body: GetInboxTodosResponse = {
			todos: result.todos.map(todoToDto),
			total: result.total,
		};
		return {
			statusCode: 200,
			body,
		};
	}
}
