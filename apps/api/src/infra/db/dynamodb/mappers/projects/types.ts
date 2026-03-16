import { BaseDynamoDBEntity } from "../../contracts/entity";

/**
 * ProjectDynamoDBEntity
 *
 * Represents the Project entity structure in DynamoDB.
 * Aligned with docs/database-design.md: all access by user (PK includes USER#userId).
 *
 * PK = USER#userId
 * SK = PROJECT#projectId
 */
export interface ProjectDynamoDBEntity extends BaseDynamoDBEntity {
	user_id: string;
	name: string;
	color: string;
	description?: string | null;
	deleted_at?: string | null; // ISO 8601 - soft delete timestamp
	created_at: string; // ISO 8601
	updated_at: string; // ISO 8601
}
