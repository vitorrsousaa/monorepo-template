import { GetInboxTodosService } from "@application/modules/todo/services/get-inbox-todos";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetInboxTodosService(): GetInboxTodosService {
	const todoRepository = makeTodoDynamoRepository();

	return new GetInboxTodosService(todoRepository);
}
