import { CreateTodoService } from "@application/modules/todo/services/create-todo";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeCreateTodoService(): CreateTodoService {
	const todoRepository = makeTodoDynamoRepository();

	return new CreateTodoService(todoRepository);
}
