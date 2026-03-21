import {
	UpdateTaskCompletionService,
	type IUpdateTaskCompletionService,
} from "@application/modules/tasks/services/update-completion";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";
import { makeCompleteTaskService } from "./complete-task";
import { makeUncompleteTaskService } from "./uncomplete-task";

export function makeUpdateTaskCompletionService(): IUpdateTaskCompletionService {
	const tasksRepository = makeTasksDynamoRepository();
	const completeTaskService = makeCompleteTaskService();
	const uncompleteTaskService = makeUncompleteTaskService();

	return new UpdateTaskCompletionService(
		tasksRepository,
		completeTaskService,
		uncompleteTaskService,
	);
}
