import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import { SectionDynamoMapper } from "@infra/db/dynamodb/mappers/sections/section-mapper";
import { SectionDynamoRepository } from "@infra/db/dynamodb/repositories/sections/section-dynamo-repository";

export function makeSectionDynamoRepository(): ISectionRepository {
	const mapper = new SectionDynamoMapper();

	return new SectionDynamoRepository(mapper);
}
