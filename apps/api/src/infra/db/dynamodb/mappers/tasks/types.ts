import type { Recurrence } from "@repo/contracts/tasks/entities";
import type { BaseDynamoDBEntity } from "../../contracts/entity";

/**
 * TasksDynamoDBEntity
 *
 * Represents the Task entity structure in DynamoDB.
 * Aligned with docs/database-design.md: all access by user (PK includes USER#userId).
 *
 * - Inbox: PK = USER#userId, SK = TASK#INBOX#PENDING#order#taskId | TASK#INBOX#COMPLETED#completedAt#taskId
 * - Project: PK = USER#userId#PROJECT#projectId, SK = TASK#PENDING#order#taskId | TASK#COMPLETED#completedAt#taskId
 */
export interface TasksDynamoDBEntity extends BaseDynamoDBEntity {
	// Partition Key: always scoped by user
	PK: string; // USER#userId (inbox) | USER#userId#PROJECT#projectId (project)
	SK: string; // TASK#INBOX#PENDING#order#taskId | TASK#INBOX#COMPLETED#completedAt#taskId | TASK#PENDING#order#taskId | TASK#COMPLETED#completedAt#taskId

	// GSI1: DueDateIndex - Search by due date (Today, Upcoming)
	// Range query: GSI1PK = USER#userId#DUE_DATE#, GSI1SK <= YYYY-MM-DD#TASK#PENDING#\uffff
	GSI1PK?: string; // USER#userId#DUE_DATE#
	GSI1SK?: string; // YYYY-MM-DD#TASK#PENDING#priority#taskId | YYYY-MM-DD#TASK#COMPLETED#completedAt#taskId

	// GSI3: SectionIndex - Search tasks by section within a project
	GSI3PK?: string; // USER#userId#PROJECT#projectId#SECTION#sectionId
	GSI3SK?: string; // TASK#PENDING#order#taskId | TASK#COMPLETED#completedAt#taskId

	// Entity attributes (snake_case)
	id: string;
	user_id: string;
	project_id?: string | null;
	section_id?: string | null;
	title: string;
	description: string | null;
	completed: boolean;
	order?: number;
	created_at: string; // ISO 8601
	updated_at: string; // ISO 8601
	completed_at?: string | null; // ISO 8601
	due_date?: string | null; // ISO 8601 - data limite para conclusão da task
	priority?: "low" | "medium" | "high" | null;

	// Recurring task fields
	recurrence?: Recurrence | null; // Stored as a DynamoDB map attribute
	next_task_id?: string | null; // ID of the next recurrence after this task is completed

	entity_type: string; // "TASKS"
}
