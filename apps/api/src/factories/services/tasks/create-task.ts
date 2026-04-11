import {
	CreateTasksService,
	type ICreateTasksService,
} from "@application/modules/tasks/services/create";
import { makePermissionService } from "@factories/services/sharing/permission-service";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeCreateTasksService(): ICreateTasksService {
	const tasksRepository = makeTasksDynamoRepository();

	return new CreateTasksService(tasksRepository, makePermissionService());
}
