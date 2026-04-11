import {
	type IUpdateTaskService,
	UpdateTaskService,
} from "@application/modules/tasks/services/update-task";
import { makePermissionService } from "@factories/services/sharing/permission-service";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeUpdateTaskService(): IUpdateTaskService {
	const tasksRepository = makeTasksDynamoRepository();
	return new UpdateTaskService(tasksRepository, makePermissionService());
}
