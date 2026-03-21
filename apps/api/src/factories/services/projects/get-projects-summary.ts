import { GetProjectsSummaryService, IGetProjectsSummaryService } from "@application/modules/projects/services/get-projects-summary/service";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeGetProjectsSummaryService(): IGetProjectsSummaryService {
	const projectRepository = makeProjectDynamoRepository();
	const taskRepository = makeTasksDynamoRepository();

	return new GetProjectsSummaryService(
		projectRepository,
		taskRepository,
	);
}
