/**
 * TodoDynamoDBEntity
 *
 * Represents the Todo entity structure in DynamoDB.
 * Aligned with docs/database-design.md: all access by user (PK includes USER#userId).
 *
 * - Inbox: PK = USER#userId, SK = TODO#INBOX#PENDING#order#todoId | TODO#INBOX#COMPLETED#completedAt#todoId
 * - Project: PK = USER#userId#PROJECT#projectId, SK = TODO#PENDING#order#todoId | TODO#COMPLETED#completedAt#todoId
 */
export interface TodoDynamoDBEntity {
	// Partition Key: always scoped by user (enables "buscar todos pelo usuário")
	PK: string; // USER#userId (inbox) | USER#userId#PROJECT#projectId (project)
	SK: string; // TODO#INBOX#PENDING#order#todoId | TODO#INBOX#COMPLETED#completedAt#todoId | TODO#PENDING#order#todoId | TODO#COMPLETED#completedAt#todoId

	// GSI1: DueDateIndex (docs)
	GSI1PK?: string; // USER#userId#DUE_DATE#YYYY-MM-DD
	GSI1SK?: string; // TODO#PENDING#priority#todoId | TODO#COMPLETED#completedAt#todoId

	// Entity attributes (snake_case)
	id: string;
	user_id: string;
	project_id?: string | null;
	title: string;
	description: string;
	completed: boolean;
	order?: number;
	created_at: string; // ISO 8601
	updated_at: string; // ISO 8601
	completed_at?: string | null; // ISO 8601
	due_date?: string | null; // ISO 8601 - data limite para conclusão da task
	priority?: "low" | "medium" | "high" | null;

	entity_type: string; // "TODO"
}
