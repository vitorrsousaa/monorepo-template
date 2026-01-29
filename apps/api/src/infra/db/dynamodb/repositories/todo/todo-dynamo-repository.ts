import type { Todo } from "@core/domain/todo/todo";
import type { TodoMapper } from "@data/protocols/todo-mapper";
import type { TodoRepository } from "@data/protocols/todo-repository";
import type { TodoDynamoDBEntity } from "@infra/db/dynamodb/mappers/types";

/**
 * TodoDynamoRepository
 *
 * DynamoDB-specific implementation for the Todo repository.
 * This class abstracts all DynamoDB access logic, keeping
 * the rest of the application agnostic to the persistence technology.
 *
 * Uses a Mapper to convert between DB format and application format.
 *
 * TODO: Implement real DynamoDB integration
 * For now, keeps data in memory for development.
 */
export class TodoDynamoRepository implements TodoRepository {
	// TODO: Replace with DynamoDB client
	// private dynamoClient: DynamoDBDocumentClient;
	// private tableName: string;

	// Temporary: In-memory simulation (DynamoDB format per docs/database-design.md)
	// PK = USER#userId (inbox) so all tasks are queryable by user
	private dbTodos: TodoDynamoDBEntity[] = [
		{
			PK: "USER#user-1",
			SK: "TODO#INBOX#PENDING#1#1",
			id: "1",
			user_id: "user-1",
			project_id: null,
			title: "Implementar arquitetura Clean",
			description: "Seguir o padrão proposto do Grypp",
			completed: false,
			order: 1,
			created_at: "2026-01-23T10:00:00.000Z",
			updated_at: "2026-01-23T10:00:00.000Z",
			completed_at: null,
			entity_type: "TODO",
		},
		{
			PK: "USER#user-1",
			SK: "TODO#INBOX#PENDING#2#2",
			id: "2",
			user_id: "user-1",
			project_id: null,
			title: "Criar módulo de autenticação",
			description: "Implementar signin, signup e refresh token",
			completed: false,
			order: 2,
			created_at: "2026-01-23T11:00:00.000Z",
			updated_at: "2026-01-23T11:00:00.000Z",
			completed_at: null,
			entity_type: "TODO",
		},
		{
			PK: "USER#user-1",
			SK: "TODO#INBOX#COMPLETED#2026-01-23T12:00:00.000Z#3",
			id: "3",
			user_id: "user-1",
			project_id: null,
			title: "Adicionar testes unitários",
			description: "Garantir cobertura de pelo menos 80%",
			completed: true,
			order: 0,
			created_at: "2026-01-23T09:00:00.000Z",
			updated_at: "2026-01-23T12:00:00.000Z",
			completed_at: "2026-01-23T12:00:00.000Z",
			entity_type: "TODO",
		},
	];

	constructor(private readonly mapper: TodoMapper<TodoDynamoDBEntity>) {}

	async findInboxTodos(userId: string): Promise<Todo[]> {
		// Docs: PK = USER#userId AND SK begins_with TODO#INBOX#
		// TODO: DynamoDB Query KeyConditionExpression: PK = :pk AND begins_with(SK, 'TODO#INBOX#')
		const pk = `USER#${userId}`;
		return this.dbTodos
			.filter((t) => t.PK === pk && t.SK.startsWith("TODO#INBOX#"))
			.map((dbTodo) => this.mapper.toDomain(dbTodo));
	}

	async findAll(): Promise<Todo[]> {
		// TODO: Implement DynamoDB query
		// const result = await this.dynamoClient.query({
		//   TableName: this.tableName,
		//   IndexName: 'GSI1',
		//   KeyConditionExpression: 'GSI1PK = :pk',
		//   ExpressionAttributeValues: { ':pk': 'TODO' }
		// });
		// return result.Items.map(item => this.mapper.toDomain(item));

		// Simulates query and maps from DB to Domain
		return this.dbTodos.map((dbTodo) => this.mapper.toDomain(dbTodo));
	}

	async findById(id: string): Promise<Todo | null> {
		// TODO: Implement DynamoDB get
		// const result = await this.dynamoClient.get({
		//   TableName: this.tableName,
		//   Key: { PK: `TODO#${id}`, SK: 'METADATA' }
		// });
		// return result.Item ? this.mapper.toDomain(result.Item) : null;

		const dbTodo = this.dbTodos.find((t) => t.id === id);
		return dbTodo ? this.mapper.toDomain(dbTodo) : null;
	}

	async create(
		data: Omit<Todo, "id" | "createdAt" | "updatedAt">,
	): Promise<Todo> {
		const now = new Date();
		const newTodo: Todo = {
			id: crypto.randomUUID(),
			...data,
			createdAt: now,
			updatedAt: now,
		};

		const dbEntity = this.mapper.toDatabase(newTodo);
		this.dbTodos.push(dbEntity);
		return newTodo;
	}

	async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
		// TODO: Implement DynamoDB update
		// const updateExpression = this.buildUpdateExpression(data);
		// const result = await this.dynamoClient.update({
		//   TableName: this.tableName,
		//   Key: { PK: `TODO#${id}`, SK: 'METADATA' },
		//   UpdateExpression: updateExpression.expression,
		//   ExpressionAttributeValues: updateExpression.values,
		//   ReturnValues: 'ALL_NEW'
		// });
		// return result.Attributes ? this.mapper.toDomain(result.Attributes) : null;

		const todoIndex = this.dbTodos.findIndex((t) => t.id === id);

		if (todoIndex === -1) {
			return null;
		}

		const currentDbTodo = this.dbTodos[todoIndex];

		if (!currentDbTodo) {
			return null;
		}

		// Converts DB entity to domain
		const currentTodo = this.mapper.toDomain(currentDbTodo);

		const updatedAt = new Date();
		const completedAt =
			data.completed === true
				? updatedAt
				: data.completed === false
					? undefined
					: currentTodo.completedAt;
		const updatedTodo: Todo = {
			id: currentTodo.id,
			userId: currentTodo.userId,
			projectId: currentTodo.projectId,
			title: data.title ?? currentTodo.title,
			description: data.description ?? currentTodo.description,
			completed: data.completed ?? currentTodo.completed,
			order: data.order ?? currentTodo.order,
			createdAt: currentTodo.createdAt,
			updatedAt,
			completedAt: completedAt ?? currentTodo.completedAt,
		};

		// Converts back to DB format
		const updatedDbEntity = this.mapper.toDatabase(updatedTodo);
		this.dbTodos[todoIndex] = updatedDbEntity;

		return updatedTodo;
	}

	async delete(id: string): Promise<boolean> {
		// TODO: Implement DynamoDB delete
		// await this.dynamoClient.delete({
		//   TableName: this.tableName,
		//   Key: { PK: `TODO#${id}`, SK: 'METADATA' }
		// });
		// return true;

		const todoIndex = this.dbTodos.findIndex((t) => t.id === id);

		if (todoIndex === -1) {
			return false;
		}

		this.dbTodos.splice(todoIndex, 1);
		return true;
	}
}
