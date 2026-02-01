import type { IGetProjectDetailService } from "@application/modules/projects/services/get-project-detail/service";
import { GetProjectDetailService } from "@application/modules/projects/services/get-project-detail/service";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeSectionDynamoRepository } from "@infra/db/dynamodb/factories/section-repository-factory";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetProjectDetailService(): IGetProjectDetailService {
	const projectRepository = makeProjectDynamoRepository();
	const sectionRepository = makeSectionDynamoRepository();
	const todoRepository = makeTodoDynamoRepository();

	return new GetProjectDetailService(
		projectRepository,
		sectionRepository,
		todoRepository,
	);
}
