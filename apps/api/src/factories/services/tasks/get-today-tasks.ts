import { GetTodayTasksService } from "@application/modules/tasks/services/get-today-tasks";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeGetTodayTasksService(): GetTodayTasksService {
	const taskRepository = makeTasksDynamoRepository();
	const projectRepository = makeProjectDynamoRepository();

	return new GetTodayTasksService(taskRepository, projectRepository);
}
