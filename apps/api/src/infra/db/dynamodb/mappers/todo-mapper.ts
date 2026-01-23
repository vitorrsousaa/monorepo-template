import type { Todo } from "@core/domain/todo/todo";
import type { TodoMapper } from "@data/protocols/todo-mapper";
import type { TodoDynamoDBEntity } from "./types";

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
			title: dbEntity.title,
			description: dbEntity.description,
			completed: dbEntity.completed,
			createdAt: new Date(dbEntity.created_at),
			updatedAt: new Date(dbEntity.updated_at),
		};
	}

	/**
	 * Maps domain entity to DynamoDB
	 *
	 * @param todo - Domain entity (camelCase)
	 * @returns TodoDynamoDBEntity - DynamoDB entity (snake_case, with PK/SK)
	 */
	toDatabase(todo: Todo): TodoDynamoDBEntity {
		return {
			// DynamoDB keys (Single-Table Design)
			PK: `TODO#${todo.id}`,
			SK: "METADATA",

			// GSI to list all TODOs
			GSI1PK: "TODO",
			GSI1SK: todo.createdAt.toISOString(),

			// Entity attributes (snake_case)
			id: todo.id,
			title: todo.title,
			description: todo.description,
			completed: todo.completed,
			created_at: todo.createdAt.toISOString(),
			updated_at: todo.updatedAt.toISOString(),

			// Metadata
			entity_type: "TODO",
		};
	}
}
