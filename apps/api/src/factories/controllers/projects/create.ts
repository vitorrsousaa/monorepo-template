import { CreateProjectController } from "@application/modules/projects/controllers/create-project";
import { makeCreateProjectService } from "@factories/services/projects/create-project";

export function makeCreateProjectController(): CreateProjectController {
	const createProjectService = makeCreateProjectService();

	return new CreateProjectController(createProjectService);
}
