import type { Section } from "@core/domain/section/section";
import type { SectionMapper } from "@data/protocols/sections/section-mapper";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { SectionDynamoDBEntity } from "@infra/db/dynamodb/mappers/sections/types";
import { randomUUID } from "node:crypto";
import { SECTION_DYNAMO_MOCKS } from "./section-dynamo-repository-mocks";

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
 *
 * TODO: Implement real DynamoDB integration
 * For now, keeps data in memory for development.
 */
export class SectionDynamoRepository implements ISectionRepository {
	// TODO: Replace with DynamoDB client
	// private dynamoClient: DynamoDBDocumentClient;
	// private tableName: string;

	// Temporary: In-memory simulation using shared mocks
	private dbSections: SectionDynamoDBEntity[] = [...SECTION_DYNAMO_MOCKS];

	constructor(private readonly mapper: SectionMapper<SectionDynamoDBEntity>) {}

	async getAllByProject(projectId: string, userId: string): Promise<Section[]> {
		// Docs: PK = USER#userId#PROJECT#projectId AND SK begins_with SECTION#
		// TODO: DynamoDB Query KeyConditionExpression: PK = :pk AND begins_with(SK, 'SECTION#')
		// FilterExpression: attribute_not_exists(deletedAt) - ALWAYS exclude soft-deleted items
		const pk = `USER#${userId}#PROJECT#${projectId}`;

		const sections = this.dbSections
			.filter((s) => s.PK === pk && s.SK.startsWith("SECTION#"))
			.filter((s) => !s.deleted_at) // Exclude soft-deleted sections
			.sort((a, b) => a.order - b.order) // Sort by order
			.map((dbSection) => this.mapper.toDomain(dbSection));

		return sections;
	}

	async getById(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<Section | null> {
		// Docs: PK = USER#userId#PROJECT#projectId AND SK = SECTION#sectionId
		// TODO: DynamoDB GetItem with PK and SK
		const pk = `USER#${userId}#PROJECT#${projectId}`;
		const sk = `SECTION#${sectionId}`;

		const dbSection = this.dbSections.find(
			(s) => s.PK === pk && s.SK === sk && !s.deleted_at,
		);

		return dbSection ? this.mapper.toDomain(dbSection) : null;
	}

	async create(
		data: Omit<Section, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Section> {
		// Generate unique ID and timestamps
		const sectionId = randomUUID();
		const now = new Date();

		// Build complete Section domain entity
		const section: Section = {
			id: sectionId,
			userId: data.userId,
			projectId: data.projectId,
			name: data.name,
			order: data.order,
			deletedAt: undefined,
			createdAt: now,
			updatedAt: now,
		};

		// Convert to DynamoDB entity using mapper
		const dbEntity = this.mapper.toDatabase(section);

		// TODO: Replace with DynamoDB PutItem
		// await this.dynamoClient.put({
		//   TableName: this.tableName,
		//   Item: dbEntity,
		// });

		// Temporary: Add to in-memory array
		this.dbSections.push(dbEntity);

		return section;
	}

	async update(
		sectionId: string,
		projectId: string,
		userId: string,
		data: Partial<Section>,
	): Promise<Section | null> {
		// Find section
		const pk = `USER#${userId}#PROJECT#${projectId}`;
		const sk = `SECTION#${sectionId}`;

		const index = this.dbSections.findIndex(
			(s) => s.PK === pk && s.SK === sk && !s.deleted_at,
		);

		if (index === -1) return null;

		// biome-ignore lint/style/noNonNullAssertion: index validated above
		const existingSection = this.mapper.toDomain(this.dbSections[index]!);

		// Merge changes
		const updatedSection: Section = {
			...existingSection,
			...data,
			id: existingSection.id, // Keep immutable
			userId: existingSection.userId, // Keep immutable
			projectId: existingSection.projectId, // Keep immutable
			createdAt: existingSection.createdAt, // Keep immutable
			updatedAt: new Date(), // Update timestamp
		};

		// Convert and update
		this.dbSections[index] = this.mapper.toDatabase(updatedSection);

		// TODO: Replace with DynamoDB UpdateItem
		// await this.dynamoClient.update({
		//   TableName: this.tableName,
		//   Key: { PK: pk, SK: sk },
		//   UpdateExpression: 'SET ...',
		// });

		return updatedSection;
	}

	async delete(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<boolean> {
		// Soft delete: set deleted_at timestamp
		const pk = `USER#${userId}#PROJECT#${projectId}`;
		const sk = `SECTION#${sectionId}`;

		const index = this.dbSections.findIndex(
			(s) => s.PK === pk && s.SK === sk && !s.deleted_at,
		);

		if (index === -1) return false;

		// Set deleted_at
		// biome-ignore lint/style/noNonNullAssertion: index validated above
		this.dbSections[index]!.deleted_at = new Date().toISOString();

		// TODO: Replace with DynamoDB UpdateItem
		// await this.dynamoClient.update({
		//   TableName: this.tableName,
		//   Key: { PK: pk, SK: sk },
		//   UpdateExpression: 'SET deleted_at = :deleted_at',
		//   ExpressionAttributeValues: { ':deleted_at': now.toISOString() },
		// });

		return true;
	}
}
