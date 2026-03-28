import { RecurrenceService } from "@application/modules/tasks/services/recurrence/service";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeRecurrenceService() {
	const tasksRepository = makeTasksDynamoRepository();
	return new RecurrenceService(tasksRepository);
}
