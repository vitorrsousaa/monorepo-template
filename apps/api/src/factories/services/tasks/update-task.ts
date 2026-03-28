import {
	UpdateTaskService,
	type IUpdateTaskService,
} from "@application/modules/tasks/services/update-task";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeUpdateTaskService(): IUpdateTaskService {
	const tasksRepository = makeTasksDynamoRepository();
	return new UpdateTaskService(tasksRepository);
}
