/**
 * Available Global Secondary Indexes in the DynamoDB single-table design.
 * Each index enables specific access patterns (see docs/database-design.md).
 */
export enum AvailableIndexes {
	GSI1 = "GSI1", // DueDateIndex - Search by due date
	GSI2 = "GSI2", // GoalIndex - Search by goal
	GSI3 = "GSI3", // SectionIndex - Search by section
	GSI4 = "GSI4", // CompletedIndex - Search by completion status
	GSI5 = "GSI5", // TagIndex - Search by tag
	GSI6 = "GSI6", // ProjectNameIndex - Search projects by name
	GSI7 = "GSI7", // RecurrenceTemplateIndex - Search by recurrence template
	GSI8 = "GSI8", // ParentTodoIndex - Search by parent todo
}

export type ValidIndexName = `${AvailableIndexes}`;

export interface BaseDynamoDBEntity extends BaseIndexes {
	id: string; // UUID
	entity_type: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
}

export interface BaseIndexes {
	PK: string;
	SK: string;
}