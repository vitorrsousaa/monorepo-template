import { UpdateTaskController } from "@application/modules/tasks/controllers/update-task";
import { makeUpdateTaskService } from "@factories/services/tasks/update-task";

export function makeUpdateTaskController() {
	return new UpdateTaskController(makeUpdateTaskService());
}
