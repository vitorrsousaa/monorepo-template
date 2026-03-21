import { GetProjectsSummaryController } from "@application/modules/projects/controllers/get-projects-summary";
import { makeGetProjectsSummaryService } from "@factories/services/projects/get-projects-summary";

export function makeGetProjectDetailController(): GetProjectsSummaryController {
	const getProjectsSummaryService = makeGetProjectsSummaryService();

	return new GetProjectsSummaryController(getProjectsSummaryService);
}
