import { GetTodosController } from "@application/modules/todos/controllers/get-todos";
import { makeGetTodosService } from "@factories/services/todo/get-todos";

export function makeGetTodosController(): GetTodosController {
	const getTodosService = makeGetTodosService();

	return new GetTodosController(getTodosService);
}
