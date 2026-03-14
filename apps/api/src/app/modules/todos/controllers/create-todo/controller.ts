import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { todoToDto } from "@application/modules/todos/mappers/todo-to-dto";
import type { ICreateTodoService } from "@application/modules/todos/services/create-todo";
import type { CreateTodoResponse } from "@repo/contracts/todo/create";
import { createTodoSchema, type CreateTodoSchema } from "./schema";

export class CreateTodoController extends Controller {
	constructor(private readonly createTodoService: ICreateTodoService) {
		super();
	}

	protected override schema = createTodoSchema;

	protected override async handle(
		request: IRequest<CreateTodoSchema>,
	): Promise<IResponse> {
		const service = await this.createTodoService.execute({
			...request.body,
			userId: request.userId ?? "",
		});
		const body: CreateTodoResponse = {
			todo: todoToDto(service.todo),
		};
		return {
			statusCode: 201,
			body,
		};
	}
}
