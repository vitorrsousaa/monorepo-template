import { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import { makeDatabaseClient } from "@infra/db/dynamodb/factories/client/database-client-factory";
import { TasksDynamoMapper } from "@infra/db/dynamodb/mappers/tasks/task-mapper";
import { TasksDynamoRepository } from "@infra/db/dynamodb/repositories/tasks/tasks-dynamo-repository";

export function makeTasksDynamoRepository(): ITasksRepository {
	const mapper = new TasksDynamoMapper();
	const databaseClient = makeDatabaseClient();

	const tasksRepositoryInstance = new TasksDynamoRepository(
		databaseClient,
		mapper,
	);

	return tasksRepositoryInstance;
}
