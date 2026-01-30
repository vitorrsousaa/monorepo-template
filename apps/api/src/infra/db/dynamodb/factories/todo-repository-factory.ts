import type { TodoRepository } from "@data/protocols/todo/todo-repository";
import { TodoDynamoMapper } from "@infra/db/dynamodb/mappers/todo-mapper";
import { TodoDynamoRepository } from "@infra/db/dynamodb/repositories/todo/todo-dynamo-repository";

export function makeTodoDynamoRepository(): TodoRepository {
	const mapper = new TodoDynamoMapper();
	const todoRepositoryInstance = new TodoDynamoRepository(mapper);

	return todoRepositoryInstance;
}
