import type { Todo } from "@core/domain/todo/todo";
import type { TodoMapper } from "@data/protocols/todo-mapper";
import type { TodoDynamoDBEntity } from "./types";

export class TodoDynamoMapper implements TodoMapper<TodoDynamoDBEntity> {
	/**
	 * Mapeia entidade do DynamoDB para domínio
	 *
	 * @param dbEntity - Entidade do DynamoDB (snake_case, com PK/SK)
	 * @returns Todo - Entidade de domínio (camelCase, limpa)
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
	 * Mapeia entidade de domínio para DynamoDB
	 *
	 * @param todo - Entidade de domínio (camelCase)
	 * @returns TodoDynamoDBEntity - Entidade do DynamoDB (snake_case, com PK/SK)
	 */
	toDatabase(todo: Todo): TodoDynamoDBEntity {
		return {
			// Chaves do DynamoDB (Single-Table Design)
			PK: `TODO#${todo.id}`,
			SK: "METADATA",

			// GSI para listar todos os TODOs
			GSI1PK: "TODO",
			GSI1SK: todo.createdAt.toISOString(),

			// Atributos da entidade (snake_case)
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
