import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { todoToDto } from "@application/modules/todos/mappers/todo-to-dto";
import type { IGetInboxTodosService } from "@application/modules/todos/services/get-inbox-todos";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { GetInboxTodosResponse } from "@repo/contracts/todo/inbox";
import { getInboxTodosSchema } from "./schema";

export class GetInboxTodosController implements IController {
	constructor(private readonly getInboxTodosService: IGetInboxTodosService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getInboxTodosSchema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.getInboxTodosService.execute(parsedBody);
			const body: GetInboxTodosResponse = {
				todos: result.todos.map(todoToDto),
				total: result.total,
			};

			return {
				statusCode: 200,
				body,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
