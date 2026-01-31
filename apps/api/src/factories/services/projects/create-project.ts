import {
	CreateProjectService,
	type ICreateProjectService,
} from "@application/modules/projects/services/create-project";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";

export function makeCreateProjectService(): ICreateProjectService {
	const projectRepository = makeProjectDynamoRepository();

	return new CreateProjectService(projectRepository);
}
