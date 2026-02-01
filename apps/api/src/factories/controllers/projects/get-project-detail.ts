import { GetProjectDetailController } from "@application/modules/projects/controllers/get-project-detail/controller";
import { makeGetProjectDetailService } from "@factories/services/projects/get-project-detail";

export function makeGetProjectDetailController(): GetProjectDetailController {
	const getProjectDetailService = makeGetProjectDetailService();

	return new GetProjectDetailController(getProjectDetailService);
}
