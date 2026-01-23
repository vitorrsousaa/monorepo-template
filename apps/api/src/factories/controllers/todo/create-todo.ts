import { CreateTodoController } from "@application/modules/todo/controllers/create-todo";
import { makeCreateTodoService } from "@factories/services/todo/create-todo";

export function makeCreateTodoController(): CreateTodoController {
	const createTodoService = makeCreateTodoService();

	return new CreateTodoController(createTodoService);
}
