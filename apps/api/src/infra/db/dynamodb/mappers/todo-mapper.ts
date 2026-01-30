import type { Todo } from "@core/domain/todo/todo";
import type { TodoMapper } from "@data/protocols/todo/todo-mapper";
import type { TodoDynamoDBEntity } from "./types";

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "#PROJECT#";
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
	 * @returns TodoDynamoDBEntity - DynamoDB entity (snake_case, with PK/SK)
	 */
	toDatabase(todo: Todo): TodoDynamoDBEntity {
		const pk = buildPK(todo.userId, todo.projectId);
		const sk = buildSK(todo);
		return {
			PK: pk,
			SK: sk,
			id: todo.id,
			user_id: todo.userId,
			project_id: todo.projectId ?? null,
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
