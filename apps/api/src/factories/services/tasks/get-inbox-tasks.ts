import {
	GetInboxTasksService,
	IGetInboxTasksService,
} from "@application/modules/tasks/services/get-inbox-tasks/service";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeGetInboxTasksService(): IGetInboxTasksService {
	const tasksRepository = makeTasksDynamoRepository();

	return new GetInboxTasksService(tasksRepository);
}
