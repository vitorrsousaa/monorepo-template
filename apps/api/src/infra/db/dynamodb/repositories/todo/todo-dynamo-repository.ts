import type { TodoRepository } from "@data/protocols/todo-repository";
import type { TodoMapper } from "@data/protocols/todo-mapper";
import type { Todo } from "@core/domain/todo/todo";
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

	// Temporary: In-memory simulation (stores in DynamoDB format - snake_case)
	private dbTodos: TodoDynamoDBEntity[] = [
		{
			PK: "TODO#1",
			SK: "METADATA",
			GSI1PK: "TODO",
			GSI1SK: "2026-01-23T10:00:00.000Z",
			id: "1",
			title: "Implementar arquitetura Clean",
			description: "Seguir o padrão proposto do Grypp",
			completed: false,
			created_at: "2026-01-23T10:00:00.000Z",
			updated_at: "2026-01-23T10:00:00.000Z",
			entity_type: "TODO",
		},
		{
			PK: "TODO#2",
			SK: "METADATA",
			GSI1PK: "TODO",
			GSI1SK: "2026-01-23T11:00:00.000Z",
			id: "2",
			title: "Criar módulo de autenticação",
			description: "Implementar signin, signup e refresh token",
			completed: false,
			created_at: "2026-01-23T11:00:00.000Z",
			updated_at: "2026-01-23T11:00:00.000Z",
			entity_type: "TODO",
		},
		{
			PK: "TODO#3",
			SK: "METADATA",
			GSI1PK: "TODO",
			GSI1SK: "2026-01-23T09:00:00.000Z",
			id: "3",
			title: "Adicionar testes unitários",
			description: "Garantir cobertura de pelo menos 80%",
			completed: true,
			created_at: "2026-01-23T09:00:00.000Z",
			updated_at: "2026-01-23T12:00:00.000Z",
			entity_type: "TODO",
		},
	];

	constructor(private readonly mapper: TodoMapper<TodoDynamoDBEntity>) {}

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
		// TODO: Implement DynamoDB put
		// const id = crypto.randomUUID();
		// const now = new Date();
		// const todo = { ...data, id, createdAt: now, updatedAt: now };
		// const dbEntity = this.mapper.toDatabase(todo);
		// await this.dynamoClient.put({
		//   TableName: this.tableName,
		//   Item: dbEntity
		// });
		// return todo;

		const now = new Date();
		const newTodo: Todo = {
			id: String(this.dbTodos.length + 1),
			...data,
			createdAt: now,
			updatedAt: now,
		};

		// Converts to DB format and stores
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

		// Applies updates
		const updatedTodo: Todo = {
			id: currentTodo.id,
			title: data.title ?? currentTodo.title,
			description: data.description ?? currentTodo.description,
			completed: data.completed ?? currentTodo.completed,
			createdAt: currentTodo.createdAt,
			updatedAt: new Date(),
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
