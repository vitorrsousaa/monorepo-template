import { randomUUID } from "node:crypto";
import type { SectionMapper } from "@data/protocols/sections/section-mapper";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { SectionDynamoDBEntity } from "@infra/db/dynamodb/mappers/sections/types";
import type { Section } from "@repo/contracts/sections/entities";
import type { IDatabaseClient } from "../../contracts/client";

/**
 * SectionDynamoRepository
 *
 * DynamoDB-specific implementation for the Section repository.
 * This class abstracts all DynamoDB access logic, keeping
 * the rest of the application agnostic to the persistence technology.
 *
 * Uses a Mapper to convert between DB format and application format.
 *
 * Access patterns per docs/database-design.md:
 * - List sections: PK = USER#userId#PROJECT#projectId AND SK begins_with SECTION#
 * - Get section: PK = USER#userId#PROJECT#projectId AND SK = SECTION#sectionId
 */
export class SectionDynamoRepository implements ISectionRepository {
	constructor(
		private readonly dynamoClient: IDatabaseClient,
		private readonly mapper: SectionMapper<SectionDynamoDBEntity>,
	) {}

	async getAllByProject(projectId: string, userId: string): Promise<Section[]> {
		const pk = `USER#${userId}#PROJECT#${projectId}`;
		const sk = "SECTION#";

		const queryResult = await this.dynamoClient.query<SectionDynamoDBEntity[]>({
			KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
			ExpressionAttributeNames: {
				"#deletedAt": "deleted_at",
			},
			ExpressionAttributeValues: {
				":pk": pk,
				":skPrefix": sk,
				":null": null,
			},
			FilterExpression:
				"attribute_not_exists(#deletedAt) OR #deletedAt = :null",
			IndexName: undefined, // Use default index
		});

		const resultSections = queryResult ? queryResult : [];

		const sections = resultSections.map((s) => this.mapper.toDomain(s));

		return sections;
	}

	async create(
		data: Omit<Section, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Section> {
		const sectionId = randomUUID();
		const now = new Date();
		const nowIso = now.toISOString();

		const section: Section = {
			id: sectionId,
			userId: data.userId,
			projectId: data.projectId,
			name: data.name,
			order: data.order,
			deletedAt: undefined,
			createdAt: nowIso,
			updatedAt: nowIso,
		};

		const dbEntity = this.mapper.toDatabase(section);

		await this.dynamoClient.create(dbEntity);

		return this.mapper.toDomain(dbEntity);
	}

	async delete(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<boolean> {
		// Soft delete: set deleted_at timestamp
		const USER_PREFIX = "USER#";
		const PROJECT_PREFIX = "PROJECT#";
		const SECTION_PREFIX = "SECTION#";
		function buildPK(userId: string, projectId: string): string {
			return `${USER_PREFIX}${userId}#${PROJECT_PREFIX}${projectId}`;
		}

		function buildSK(sectionId: string): string {
			return `${SECTION_PREFIX}${sectionId}`;
		}

		const pk = buildPK(userId, projectId);
		const sk = buildSK(sectionId);

		const nowIso = new Date().toISOString();
		await this.dynamoClient.update({
			Key: { PK: pk, SK: sk },
			UpdateExpression: "SET deleted_at = :deleted_at",
			ExpressionAttributeValues: { ":deleted_at": nowIso },
		});

		return true;
	}
}
