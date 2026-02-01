/**
 * SectionDynamoDBEntity
 *
 * Represents the Section entity structure in DynamoDB.
 * Aligned with docs/database-design.md.
 *
 * PK = USER#userId#PROJECT#projectId
 * SK = SECTION#sectionId
 */
export interface SectionDynamoDBEntity {
	// Partition Key: scoped by user and project
	PK: string; // USER#userId#PROJECT#projectId
	SK: string; // SECTION#sectionId

	// Entity attributes (snake_case)
	id: string;
	user_id: string;
	project_id: string;
	name: string;
	description?: string | null;
	order: number;
	deleted_at?: string | null; // ISO 8601 - soft delete timestamp
	created_at: string; // ISO 8601
	updated_at: string; // ISO 8601

	entity_type: string; // "SECTION"
}
