import type { Todo } from "@core/domain/todo/todo";
import type { TasksMapper } from "@data/protocols/tasks/tasks-mapper";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { TodoDynamoDBEntity } from "@infra/db/dynamodb/mappers/todo/types";
import type { Task } from "@repo/contracts/tasks";
import { IDatabaseClient } from "../../contracts/client";
import { TasksDynamoDBEntity } from "../../mappers/tasks/types";
import { TODO_DYNAMO_MOCKS } from "./todo-dynamo-repository.mocks";

/**
 * TasksDynamoRepository
 *
 * DynamoDB-specific implementation for the Tasks repository.
 * This class abstracts all DynamoDB access logic, keeping
 * the rest of the application agnostic to the persistence technology.
 *
 * Uses a Mapper to convert between DB format and application format.
 *
 * TODO: Implement real DynamoDB integration
 * For now, keeps data in memory for development (see tasks-dynamo-repository.mocks.ts).
 */
export class TasksDynamoRepository implements ITasksRepository {
	private dbTodos: TodoDynamoDBEntity[] = [...TODO_DYNAMO_MOCKS];

	constructor(
		private readonly dynamoClient: IDatabaseClient,
		private readonly mapper: TasksMapper<TasksDynamoDBEntity>,
	) {}

	async create(
		data: Omit<
			Task,
			"id" | "createdAt" | "updatedAt" | "completedAt" | "completed" | "order"
		>,
	): Promise<Task> {
		const now = new Date();
		const nowIso = now.toISOString();
		const newTask: Task = {
			id: crypto.randomUUID(),
			...data,
			createdAt: nowIso,
			updatedAt: nowIso,
			completedAt: null,
			completed: false,
			order: 0,
		};

		const dbEntity = this.mapper.toDatabase(newTask);

		await this.dynamoClient.create(dbEntity);
		return newTask;
	}

	async getInbox(userId: string): Promise<Task[]> {
		const pk = `USER#${userId}`;

		const queryResult = await this.dynamoClient.query<TasksDynamoDBEntity[]>({
			KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
			ExpressionAttributeNames: {
				"#deletedAt": "deleted_at",
				"#completed": "completed",
			},
			ExpressionAttributeValues: {
				":pk": pk,
				":skPrefix": "TASK#INBOX#PENDING#",
				":falseValue": false,
			},
			FilterExpression: `attribute_not_exists(#deletedAt) AND #completed = :falseValue`,
			IndexName: undefined,
		});

		const resultTasks = queryResult ? queryResult : [];

		const tasks = resultTasks.map((dbTodo) => this.mapper.toDomain(dbTodo));

		return tasks;
	}

	async findTodayTodos(userId: string): Promise<Todo[]> {
		// Docs: GSI1 DueDateIndex - GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD
		// Domain: dueDate <= hoje AND completed = false
		const todayEnd = new Date();
		todayEnd.setHours(23, 59, 59, 999);
		const todayEndMs = todayEnd.getTime();

		return this.dbTodos
			.filter((t) => t.user_id === userId && t.completed === false)
			.filter((t) => {
				if (!t.due_date) return false;
				return new Date(t.due_date).getTime() <= todayEndMs;
			})
			.sort((a, b) => {
				// Overdue first (domain: atrasadas no topo)
				const aMs = a.due_date ? new Date(a.due_date).getTime() : 0;
				const bMs = b.due_date ? new Date(b.due_date).getTime() : 0;
				return aMs - bMs;
			})
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

	async getAllPendingByProject(
		projectId: string,
		userId: string,
	): Promise<Task[]> {
		const pk = `USER#${userId}#PROJECT#${projectId}`;

		const queryResult = await this.dynamoClient.query<TasksDynamoDBEntity[]>({
			KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
			ExpressionAttributeNames: {
				"#deletedAt": "deleted_at",
			},
			ExpressionAttributeValues: {
				":pk": pk,
				":skPrefix": "TASK#PENDING#",
			},
			FilterExpression: "attribute_not_exists(#deletedAt)",
			IndexName: undefined,
		});

		const results = queryResult ? queryResult : [];
		return results.map((dbEntity) => this.mapper.toDomain(dbEntity));
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
