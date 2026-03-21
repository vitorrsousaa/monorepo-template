import { UpdateTaskCompletionController } from "@application/modules/tasks/controllers/update-completion";
import { makeUpdateTaskCompletionService } from "@factories/services/tasks/update-task-completion";

export function makeUpdateTaskCompletionController(): UpdateTaskCompletionController {
	const updateTaskCompletionService = makeUpdateTaskCompletionService();
	return new UpdateTaskCompletionController(updateTaskCompletionService);
}
