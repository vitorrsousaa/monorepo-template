import type { TasksDynamoDBEntity } from "@infra/db/dynamodb/mappers/tasks/types";

const defaults: TasksDynamoDBEntity = {
	PK: "USER#user-001",
	SK: "TASK#INBOX#PENDING#0#task-001",
	id: "task-001",
	user_id: "user-001",
	project_id: null,
	section_id: null,
	title: "Test task",
	description: null,
	completed: false,
	order: 0,
	created_at: "2024-01-01T00:00:00.000Z",
	updated_at: "2024-01-01T00:00:00.000Z",
	completed_at: null,
	due_date: null,
	priority: null,
	entity_type: "TASK",
};

export function buildTaskDynamoEntity(
	overrides?: Partial<TasksDynamoDBEntity>,
): TasksDynamoDBEntity {
	return { ...defaults, ...overrides };
}
