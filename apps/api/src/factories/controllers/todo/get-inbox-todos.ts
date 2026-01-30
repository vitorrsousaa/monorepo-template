import { GetInboxTodosController } from "@application/modules/todos/controllers/get-inbox-todos";
import { makeGetInboxTodosService } from "@factories/services/todo/get-inbox-todos";

export function makeGetInboxTodosController(): GetInboxTodosController {
	const getInboxTodosService = makeGetInboxTodosService();

	return new GetInboxTodosController(getInboxTodosService);
}
