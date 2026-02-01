import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
import { TodoDynamoMapper } from "@infra/db/dynamodb/mappers/todo/todo-mapper";
import { TodoDynamoRepository } from "@infra/db/dynamodb/repositories/todo/todo-dynamo-repository";

export function makeTodoDynamoRepository(): ITodoRepository {
	const mapper = new TodoDynamoMapper();
	const todoRepositoryInstance = new TodoDynamoRepository(mapper);

	return todoRepositoryInstance;
}
