/**
 * TodoDynamoDBEntity
 *
 * Represents the Todo entity structure in DynamoDB.
 *
 * Characteristics:
 * - Uses snake_case (common database standard)
 * - Includes partition (PK) and sort (SK) keys
 * - Includes GSI keys for alternative queries
 * - Dates stored as ISO string
 */
export interface TodoDynamoDBEntity {
	// Partition Key and Sort Key (Single-Table Design)
	PK: string; // Format: "TODO#${id}"
	SK: string; // Format: "METADATA"

	// GSI to list all TODOs
	GSI1PK: string; // Format: "TODO"
	GSI1SK: string; // Format: ISO timestamp (sorted by date)

	// Entity attributes (snake_case)
	id: string;
	title: string;
	description: string;
	completed: boolean;
	created_at: string; // ISO 8601 string
	updated_at: string; // ISO 8601 string

	// Metadata
	entity_type: string; // "TODO"
}
