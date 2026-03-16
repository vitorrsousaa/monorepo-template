import { GetInboxTasksController } from "@application/modules/tasks/controllers/get-inbox-tasks";
import { makeGetInboxTasksService } from "@factories/services/tasks/get-inbox-tasks";

export function makeGetInboxTasksController(): GetInboxTasksController {
	const GetInboxTasksService = makeGetInboxTasksService();

	return new GetInboxTasksController(GetInboxTasksService);
}
