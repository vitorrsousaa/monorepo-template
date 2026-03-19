import type { IGetProjectDetailService } from "@application/modules/projects/services/get-project-detail/service";
import { GetProjectDetailService } from "@application/modules/projects/services/get-project-detail/service";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeSectionDynamoRepository } from "@infra/db/dynamodb/factories/section-repository-factory";
import { makeTasksDynamoRepository } from "@infra/db/dynamodb/factories/tasks-repository-factory";

export function makeGetProjectDetailService(): IGetProjectDetailService {
	const projectRepository = makeProjectDynamoRepository();
	const sectionRepository = makeSectionDynamoRepository();
	const taskRepository = makeTasksDynamoRepository();

	return new GetProjectDetailService(
		projectRepository,
		sectionRepository,
		taskRepository,
	);
}
