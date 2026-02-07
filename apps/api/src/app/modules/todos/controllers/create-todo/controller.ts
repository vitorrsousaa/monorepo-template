import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { todoToDto } from "@application/modules/todos/mappers/todo-to-dto";
import type { ICreateTodoService } from "@application/modules/todos/services/create-todo";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { CreateTodoResponse } from "@repo/contracts/todo/create";
import { createTodoSchema } from "./schema";

export class CreateTodoController implements IController {
	constructor(private readonly createTodoService: ICreateTodoService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(createTodoSchema, {
				...request.body,
				userId: request.userId ?? "",
			});

			if (!status) return parsedBody;

			const service = await this.createTodoService.execute(parsedBody);
			const body: CreateTodoResponse = {
				todo: todoToDto(service.todo),
			};

			return {
				statusCode: 201,
				body,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
