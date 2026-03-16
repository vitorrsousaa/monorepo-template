import { CreateTasksController } from "@application/modules/tasks/controllers/create/controller";
import { makeCreateTasksService } from "@factories/services/tasks/create-task";

export function makeCreateTasksController(): CreateTasksController {
	const CreateTasksService = makeCreateTasksService();

	return new CreateTasksController(CreateTasksService);
}
