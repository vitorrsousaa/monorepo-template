import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import { makeDatabaseClient } from "@infra/db/dynamodb/factories/client/database-client-factory";
import { SectionDynamoMapper } from "@infra/db/dynamodb/mappers/sections/section-mapper";
import { SectionDynamoRepository } from "@infra/db/dynamodb/repositories/sections/section-dynamo-repository";

export function makeSectionDynamoRepository(): ISectionRepository {
	const mapper = new SectionDynamoMapper();
	const databaseClient = makeDatabaseClient();

	return new SectionDynamoRepository(databaseClient, mapper);
}
