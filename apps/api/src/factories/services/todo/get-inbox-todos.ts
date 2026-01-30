import { GetInboxTodosService } from "@application/modules/todos/services/get-inbox-todos";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetInboxTodosService(): GetInboxTodosService {
	const todoRepository = makeTodoDynamoRepository();

	return new GetInboxTodosService(todoRepository);
}
