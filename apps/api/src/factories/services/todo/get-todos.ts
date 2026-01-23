import { GetTodosService } from "@application/modules/todo/services/get-todos";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetTodosService(): GetTodosService {
	const todoRepository = makeTodoDynamoRepository();

	return new GetTodosService(todoRepository);
}
