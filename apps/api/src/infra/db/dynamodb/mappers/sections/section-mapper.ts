import type { Section } from "@core/domain/section/section";
import type { SectionMapper } from "@data/protocols/sections/section-mapper";
import type { SectionDynamoDBEntity } from "./types";

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "PROJECT#";
const SECTION_PREFIX = "SECTION#";

function buildPK(userId: string, projectId: string): string {
	return `${USER_PREFIX}${userId}#${PROJECT_PREFIX}${projectId}`;
}

function buildSK(sectionId: string): string {
	return `${SECTION_PREFIX}${sectionId}`;
}

export class SectionDynamoMapper
	implements SectionMapper<SectionDynamoDBEntity>
{
	/**
	 * Maps DynamoDB entity to domain
	 *
	 * @param dbEntity - DynamoDB entity (snake_case, with PK/SK)
	 * @returns Section - Domain entity (camelCase, clean)
	 */
	toDomain(dbEntity: SectionDynamoDBEntity): Section {
		return {
			id: dbEntity.id,
			userId: dbEntity.user_id,
			projectId: dbEntity.project_id,
			name: dbEntity.name,
			order: dbEntity.order,
			deletedAt: dbEntity.deleted_at
				? new Date(dbEntity.deleted_at)
				: undefined,
			createdAt: new Date(dbEntity.created_at),
			updatedAt: new Date(dbEntity.updated_at),
		};
	}

	/**
	 * Maps domain entity to DynamoDB
	 *
	 * @param section - Domain entity (camelCase)
	 * @returns SectionDynamoDBEntity - DynamoDB entity (snake_case, with PK/SK)
	 */
	toDatabase(section: Section): SectionDynamoDBEntity {
		const pk = buildPK(section.userId, section.projectId);
		const sk = buildSK(section.id);

		return {
			PK: pk,
			SK: sk,
			id: section.id,
			user_id: section.userId,
			project_id: section.projectId,
			name: section.name,
			order: section.order,
			deleted_at: section.deletedAt?.toISOString() ?? null,
			created_at: section.createdAt.toISOString(),
			updated_at: section.updatedAt.toISOString(),
			entity_type: "SECTION",
		};
	}
}
