import {
	CompleteTaskService,
	type ICompleteTaskService,
} from "@application/modules/tasks/services/complete-task";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeCompleteTaskService(): ICompleteTaskService {
	const tasksRepository = makeTasksDynamoRepository();
	return new CompleteTaskService(tasksRepository);
}
