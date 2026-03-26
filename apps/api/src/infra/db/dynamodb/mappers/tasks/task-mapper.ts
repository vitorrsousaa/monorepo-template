import type { TasksMapper } from "@data/protocols/tasks/tasks-mapper";
import type { Task } from "@repo/contracts/tasks";
import type { TasksDynamoDBEntity } from "./types";

// Task na Inbox:
//   PK = USER#<userId>
//   SK = TODO#INBOX#PENDING#<order>#<taskId>
//   SK = TODO#INBOX#COMPLETED#<completedAt>#<taskId>

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "#PROJECT#";
const SECTION_PREFIX = "#SECTION#";
const DUE_DATE_PREFIX = "#DUE_DATE#";
const TASK_INBOX_PENDING = "TASK#INBOX#PENDING#";
const TASK_INBOX_COMPLETED = "TASK#INBOX#COMPLETED#";
const TASK_PENDING = "TASK#PENDING#";
const TASK_COMPLETED = "TASK#COMPLETED#";

function buildPK(userId: string, projectId?: string | null): string {
	if (projectId) {
		return `${USER_PREFIX}${userId}${PROJECT_PREFIX}${projectId}`;
	}
	return `${USER_PREFIX}${userId}`;
}

function buildSK(task: Task): string {
	const order = task.order ?? 0;
	const completedAt = task?.completedAt
		? new Date(task.completedAt).toISOString()
		: "";
	if (task.projectId) {
		return task.completed
			? `${TASK_COMPLETED}${completedAt}#${task.id}`
			: `${TASK_PENDING}${order}#${task.id}`;
	}
	return task.completed
		? `${TASK_INBOX_COMPLETED}${completedAt}#${task.id}`
		: `${TASK_INBOX_PENDING}${order}#${task.id}`;
}

function buildGSI1PK(userId: string): string {
	return `${USER_PREFIX}${userId}${DUE_DATE_PREFIX}`;
}

function buildGSI1SK(task: Task): string {
	const dueDate = task.dueDate
		? new Date(task.dueDate).toISOString().split("T")[0]
		: "";
	const priority = task.priority ?? "medium";
	const completedAt = task?.completedAt
		? new Date(task.completedAt).toISOString()
		: "";

	return task.completed
		? `${dueDate}#${TASK_COMPLETED}${completedAt}#${task.id}`
		: `${dueDate}#${TASK_PENDING}${priority}#${task.id}`;
}

function buildGSI3PK(
	userId: string,
	projectId: string,
	sectionId: string,
): string {
	return `${USER_PREFIX}${userId}${PROJECT_PREFIX}${projectId}${SECTION_PREFIX}${sectionId}`;
}

function buildGSI3SK(task: Task): string {
	const order = task.order ?? 0;
	const completedAt = task?.completedAt
		? new Date(task.completedAt)?.toISOString()
		: "";

	return task.completed
		? `${TASK_COMPLETED}${completedAt}#${task.id}`
		: `${TASK_PENDING}${order}#${task.id}`;
}

export class TasksDynamoMapper implements TasksMapper<TasksDynamoDBEntity> {
	/**
	 * Maps DynamoDB entity to domain
	 *
	 * @param dbEntity - DynamoDB entity (snake_case, with PK/SK)
	 * @returns Task - Domain entity (camelCase, clean)
	 */
	toDomain(dbEntity: TasksDynamoDBEntity): Task {
		return {
			id: dbEntity.id,
			userId: dbEntity.user_id,
			projectId: dbEntity.project_id ?? null,
			sectionId: dbEntity.section_id ?? null,
			title: dbEntity.title,
			description: dbEntity.description,
			completed: dbEntity.completed,
			order: dbEntity.order,
			createdAt: new Date(dbEntity.created_at).toISOString(),
			updatedAt: new Date(dbEntity.updated_at).toISOString(),
			completedAt: dbEntity.completed_at
				? new Date(dbEntity.completed_at).toISOString()
				: null,
			dueDate: dbEntity.due_date
				? new Date(dbEntity.due_date).toISOString()
				: null,
			priority: dbEntity.priority ?? null,
		};
	}

	/**
	 * Maps domain entity to DynamoDB
	 *
	 * @param task - Domain entity (camelCase)
	 * @returns TasksDynamoDBEntity - DynamoDB entity (snake_case, with PK/SK and GSI)
	 */
	toDatabase(task: Task): TasksDynamoDBEntity {
		const pk = buildPK(task.userId, task.projectId);
		const sk = buildSK(task);

		// Build GSI1 (DueDateIndex) if task has dueDate
		const gsi1pk = task.dueDate ? buildGSI1PK(task.userId) : undefined;
		const gsi1sk = task.dueDate ? buildGSI1SK(task) : undefined;

		// Build GSI3 (SectionIndex) if task belongs to a section
		const gsi3pk =
			task.projectId && task.sectionId
				? buildGSI3PK(task.userId, task.projectId, task.sectionId)
				: undefined;
		const gsi3sk =
			task.projectId && task.sectionId ? buildGSI3SK(task) : undefined;

		return {
			PK: pk,
			SK: sk,
			GSI1PK: gsi1pk,
			GSI1SK: gsi1sk,
			// GSI3PK: gsi3pk,
			// GSI3SK: gsi3sk,
			id: task.id,
			user_id: task.userId,
			project_id: task.projectId ?? null,
			section_id: task.sectionId ?? null,
			title: task.title,
			description: task.description,
			completed: task.completed,
			order: task.order,
			created_at: new Date(task.createdAt).toISOString(),
			updated_at: new Date(task.updatedAt).toISOString(),
			completed_at: task?.completedAt
				? new Date(task.completedAt).toISOString()
				: null,
			due_date: task?.dueDate ? new Date(task.dueDate).toISOString() : null,
			priority: task.priority ?? null,
			entity_type: "TASK",
		};
	}
}
