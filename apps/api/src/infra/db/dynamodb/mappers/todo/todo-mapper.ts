import type { Todo } from "@core/domain/todo/todo";
import type { TodoMapper } from "@data/protocols/todo/todo-mapper";
import type { TodoDynamoDBEntity } from "./types";

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "#PROJECT#";
const SECTION_PREFIX = "#SECTION#";
const DUE_DATE_PREFIX = "#DUE_DATE#";
const TODO_INBOX_PENDING = "TODO#INBOX#PENDING#";
const TODO_INBOX_COMPLETED = "TODO#INBOX#COMPLETED#";
const TODO_PENDING = "TODO#PENDING#";
const TODO_COMPLETED = "TODO#COMPLETED#";

function buildPK(userId: string, projectId?: string | null): string {
	if (projectId) {
		return `${USER_PREFIX}${userId}${PROJECT_PREFIX}${projectId}`;
	}
	return `${USER_PREFIX}${userId}`;
}

function buildSK(todo: Todo): string {
	const order = todo.order ?? 0;
	const completedAt = todo.completedAt?.toISOString() ?? "";
	if (todo.projectId) {
		return todo.completed
			? `${TODO_COMPLETED}${completedAt}#${todo.id}`
			: `${TODO_PENDING}${order}#${todo.id}`;
	}
	return todo.completed
		? `${TODO_INBOX_COMPLETED}${completedAt}#${todo.id}`
		: `${TODO_INBOX_PENDING}${order}#${todo.id}`;
}

function buildGSI1PK(userId: string, dueDate: Date): string {
	const dateStr = dueDate.toISOString().split("T")[0]; // YYYY-MM-DD
	return `${USER_PREFIX}${userId}${DUE_DATE_PREFIX}${dateStr}`;
}

function buildGSI1SK(todo: Todo): string {
	const priority = todo.priority ?? "medium"; // Default priority for sorting
	const completedAt = todo.completedAt?.toISOString() ?? "";

	return todo.completed
		? `${TODO_COMPLETED}${completedAt}#${todo.id}`
		: `${TODO_PENDING}${priority}#${todo.id}`;
}

function buildGSI3PK(
	userId: string,
	projectId: string,
	sectionId: string,
): string {
	return `${USER_PREFIX}${userId}${PROJECT_PREFIX}${projectId}${SECTION_PREFIX}${sectionId}`;
}

function buildGSI3SK(todo: Todo): string {
	const order = todo.order ?? 0;
	const completedAt = todo.completedAt?.toISOString() ?? "";

	return todo.completed
		? `${TODO_COMPLETED}${completedAt}#${todo.id}`
		: `${TODO_PENDING}${order}#${todo.id}`;
}

export class TodoDynamoMapper implements TodoMapper<TodoDynamoDBEntity> {
	/**
	 * Maps DynamoDB entity to domain
	 *
	 * @param dbEntity - DynamoDB entity (snake_case, with PK/SK)
	 * @returns Todo - Domain entity (camelCase, clean)
	 */
	toDomain(dbEntity: TodoDynamoDBEntity): Todo {
		return {
			id: dbEntity.id,
			userId: dbEntity.user_id,
			projectId: dbEntity.project_id ?? undefined,
			sectionId: dbEntity.section_id ?? undefined,
			title: dbEntity.title,
			description: dbEntity.description,
			completed: dbEntity.completed,
			order: dbEntity.order,
			createdAt: new Date(dbEntity.created_at),
			updatedAt: new Date(dbEntity.updated_at),
			completedAt: dbEntity.completed_at
				? new Date(dbEntity.completed_at)
				: undefined,
			dueDate: dbEntity.due_date ? new Date(dbEntity.due_date) : undefined,
			priority: dbEntity.priority ?? undefined,
		};
	}

	/**
	 * Maps domain entity to DynamoDB
	 *
	 * @param todo - Domain entity (camelCase)
	 * @returns TodoDynamoDBEntity - DynamoDB entity (snake_case, with PK/SK and GSI)
	 */
	toDatabase(todo: Todo): TodoDynamoDBEntity {
		const pk = buildPK(todo.userId, todo.projectId);
		const sk = buildSK(todo);

		// Build GSI1 (DueDateIndex) if todo has dueDate
		const gsi1pk = todo.dueDate
			? buildGSI1PK(todo.userId, todo.dueDate)
			: undefined;
		const gsi1sk = todo.dueDate ? buildGSI1SK(todo) : undefined;

		// Build GSI3 (SectionIndex) if todo belongs to a section
		const gsi3pk =
			todo.projectId && todo.sectionId
				? buildGSI3PK(todo.userId, todo.projectId, todo.sectionId)
				: undefined;
		const gsi3sk =
			todo.projectId && todo.sectionId ? buildGSI3SK(todo) : undefined;

		return {
			PK: pk,
			SK: sk,
			GSI1PK: gsi1pk,
			GSI1SK: gsi1sk,
			GSI3PK: gsi3pk,
			GSI3SK: gsi3sk,
			id: todo.id,
			user_id: todo.userId,
			project_id: todo.projectId ?? null,
			section_id: todo.sectionId ?? null,
			title: todo.title,
			description: todo.description,
			completed: todo.completed,
			order: todo.order,
			created_at: todo.createdAt.toISOString(),
			updated_at: todo.updatedAt.toISOString(),
			completed_at: todo.completedAt?.toISOString() ?? null,
			due_date: todo.dueDate?.toISOString() ?? null,
			priority: todo.priority ?? null,
			entity_type: "TODO",
		};
	}
}
