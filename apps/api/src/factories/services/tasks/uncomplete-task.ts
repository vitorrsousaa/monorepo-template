import {
	UncompleteTaskService,
	type IUncompleteTaskService,
} from "@application/modules/tasks/services/uncomplete-task";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeUncompleteTaskService(): IUncompleteTaskService {
	const tasksRepository = makeTasksDynamoRepository();
	return new UncompleteTaskService(tasksRepository);
}
