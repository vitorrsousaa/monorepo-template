import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import { makeDatabaseClient } from "@infra/db/dynamodb/factories/client/database-client-factory";
import { ProjectDynamoMapper } from "@infra/db/dynamodb/mappers/projects/project-mapper";
import { ProjectDynamoRepository } from "@infra/db/dynamodb/repositories/projects/project-dynamo-repository";

export function makeProjectDynamoRepository(): IProjectRepository {
	const mapper = new ProjectDynamoMapper();
	const databaseClient = makeDatabaseClient();

	const projectRepositoryInstance = new ProjectDynamoRepository(
		databaseClient,
		mapper,
	);

	return projectRepositoryInstance;
}
