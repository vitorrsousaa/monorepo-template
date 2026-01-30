import { GetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";

export function makeGetAllProjectsByUserService(): GetAllProjectsByUserService {
	const projectRepository = makeProjectDynamoRepository();

	return new GetAllProjectsByUserService(projectRepository);
}
