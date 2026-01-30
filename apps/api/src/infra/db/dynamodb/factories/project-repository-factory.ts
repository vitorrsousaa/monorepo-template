import type { ProjectRepository } from "@data/protocols/projects/project-repository";
import { ProjectDynamoMapper } from "@infra/db/dynamodb/mappers/projects/project-mapper";
import { ProjectDynamoRepository } from "@infra/db/dynamodb/repositories/projects/project-dynamo-repository";

export function makeProjectDynamoRepository(): ProjectRepository {
	const mapper = new ProjectDynamoMapper();
	const projectRepositoryInstance = new ProjectDynamoRepository(mapper);

	return projectRepositoryInstance;
}
