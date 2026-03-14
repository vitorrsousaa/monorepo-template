import { GetTodayTasksController } from "@application/modules/tasks/controllers/get-today-tasks";
import { makeGetTodayTasksService } from "@factories/services/tasks/get-today-tasks";

export function makeGetTodayTasksController(): GetTodayTasksController {
	const getTodayTasksService = makeGetTodayTasksService();

	return new GetTodayTasksController(getTodayTasksService);
}
