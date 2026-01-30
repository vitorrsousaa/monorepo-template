/**
 * ProjectDynamoDBEntity
 *
 * Represents the Project entity structure in DynamoDB.
 * Aligned with docs/database-design.md: all access by user (PK includes USER#userId).
 *
 * PK = USER#userId
 * SK = PROJECT#projectId
 */
export interface ProjectDynamoDBEntity {
	// Partition Key: always scoped by user
	PK: string; // USER#userId
	SK: string; // PROJECT#projectId

	// GSI6: ProjectNameIndex - For alphabetical listing
	GSI6PK?: string; // USER#userId
	GSI6SK?: string; // PROJECT#name#projectId

	// Entity attributes (snake_case)
	id: string;
	user_id: string;
	name: string;
	description?: string | null;
	deleted_at?: string | null; // ISO 8601 - soft delete timestamp
	created_at: string; // ISO 8601
	updated_at: string; // ISO 8601

	entity_type: string; // "PROJECT"
}
