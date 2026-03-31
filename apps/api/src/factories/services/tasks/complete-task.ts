import {
	CompleteTaskService,
	type ICompleteTaskService,
} from "@application/modules/tasks/services/complete-task";
import { RecurrenceService } from "@application/modules/tasks/services/recurrence";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeCompleteTaskService(): ICompleteTaskService {
	const tasksRepository = makeTasksDynamoRepository();
	const recurrenceService = new RecurrenceService(tasksRepository);
	return new CompleteTaskService(tasksRepository, recurrenceService);
}
