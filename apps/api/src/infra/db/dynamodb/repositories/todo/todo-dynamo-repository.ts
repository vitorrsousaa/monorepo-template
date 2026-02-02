import type { Todo } from "@core/domain/todo/todo";
import type { TodoMapper } from "@data/protocols/todo/todo-mapper";
import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
import type { TodoDynamoDBEntity } from "@infra/db/dynamodb/mappers/todo/types";
import { TODO_DYNAMO_MOCKS } from "./todo-dynamo-repository.mocks";

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
 * For now, keeps data in memory for development (see todo-dynamo-repository.mocks.ts).
 */
export class TodoDynamoRepository implements ITodoRepository {
	// TODO: Replace with DynamoDB client
	// private dynamoClient: DynamoDBDocumentClient;
	// private tableName: string;

	// Temporary: In-memory simulation using shared mocks (PK = USER#userId per docs/database-design.md)
	private dbTodos: TodoDynamoDBEntity[] = [...TODO_DYNAMO_MOCKS];

	constructor(private readonly mapper: TodoMapper<TodoDynamoDBEntity>) {}

	async findInboxTodos(userId: string): Promise<Todo[]> {
		// Docs: PK = USER#userId AND SK begins_with TODO#INBOX#
		// TODO: DynamoDB Query KeyConditionExpression: PK = :pk AND begins_with(SK, 'TODO#INBOX#')
		const pk = `USER#${userId}`;
		return this.dbTodos
			.filter((t) => t.PK === pk && t.SK.startsWith("TODO#INBOX#"))
			.filter((t) => t.completed === false)
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
			dueDate: data.dueDate !== undefined ? data.dueDate : currentTodo.dueDate,
			priority:
				data.priority !== undefined ? data.priority : currentTodo.priority,
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

	async getAllBySection(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<Todo[]> {
		// Docs: Use GSI3 (SectionIndex) to query todos by section
		// Real DynamoDB Query:
		// IndexName: 'GSI3-SectionIndex'
		// KeyConditionExpression: GSI3PK = :gsi3pk AND begins_with(GSI3SK, 'TODO#PENDING#')
		// FilterExpression: attribute_not_exists(deleted_at)

		const gsi3pk = `USER#${userId}#PROJECT#${projectId}#SECTION#${sectionId}`;

		// Simulating GSI3 query (orders by GSI3SK which includes order)
		return this.dbTodos
			.filter(
				(t) => t.GSI3PK === gsi3pk && t.GSI3SK?.startsWith("TODO#PENDING#"),
			)
			.filter((t) => !t.completed) // Additional safety check
			.sort((a, b) => {
				// GSI3SK format: TODO#PENDING#order#todoId
				// Sorting by GSI3SK gives correct order
				const skA = a.GSI3SK || "";
				const skB = b.GSI3SK || "";
				return skA.localeCompare(skB);
			})
			.map((dbTodo) => this.mapper.toDomain(dbTodo));
	}

	async getTodosByProjectWithoutSection(
		projectId: string,
		userId: string,
	): Promise<Todo[]> {
		// Docs: PK = USER#userId#PROJECT#projectId, todos without section have no GSI3PK / section_id null
		const pk = `USER#${userId}#PROJECT#${projectId}`;

		return this.dbTodos
			.filter(
				(t) =>
					t.PK === pk &&
					(t.section_id === null || t.section_id === undefined) &&
					!t.SK.startsWith("TODO#INBOX#"),
			)
			.sort((a, b) => {
				const skA = a.SK || "";
				const skB = b.SK || "";
				return skA.localeCompare(skB);
			})
			.map((dbTodo) => this.mapper.toDomain(dbTodo));
	}
}
