import {
	CreateTasksService,
	ICreateTasksService,
} from "@application/modules/tasks/services/create";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeCreateTasksService(): ICreateTasksService {
	const tasksRepository = makeTasksDynamoRepository();

	return new CreateTasksService(tasksRepository);
}
