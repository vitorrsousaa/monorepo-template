import { GetTodayTasksService } from "@application/modules/tasks/services/get-today-tasks";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetTodayTasksService(): GetTodayTasksService {
	const todoRepository = makeTodoDynamoRepository();
	const projectRepository = makeProjectDynamoRepository();

	return new GetTodayTasksService(todoRepository, projectRepository);
}
