import type { Todo } from "@core/domain/todo/todo";
import type { TasksMapper } from "@data/protocols/tasks/tasks-mapper";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { TodoDynamoDBEntity } from "@infra/db/dynamodb/mappers/todo/types";
import type { Task } from "@repo/contracts/tasks";
import type { IDatabaseClient } from "../../contracts/client";
import { AvailableIndexes } from "../../contracts/entity";
import type { TasksDynamoDBEntity } from "../../mappers/tasks/types";
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
			FilterExpression:
				"attribute_not_exists(#deletedAt) AND #completed = :falseValue",
			IndexName: undefined,
		});

		const resultTasks = queryResult ? queryResult : [];

		const tasks = resultTasks.map((dbTodo) => this.mapper.toDomain(dbTodo));

		return tasks;
	}

	async getTodayTasks(userId: string): Promise<Task[]> {
		// GSI1 DueDateIndex - range query: dueDate <= today AND completed = false
		// GSI1PK = USER#userId#DUE_DATE#
		// GSI1SK <= YYYY-MM-DD#TASK#PENDING#\uffff (includes overdue + today, excludes future)
		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
		const gsi1pk = `USER#${userId}#DUE_DATE#`;
		const todayEnd = `${today}#TASK#PENDING#\uffff`;

		const queryResult = await this.dynamoClient.query<TasksDynamoDBEntity[]>({
			KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK <= :todayEnd",
			ExpressionAttributeNames: {
				"#deletedAt": "deleted_at",
				"#completed": "completed",
			},
			ExpressionAttributeValues: {
				":gsi1pk": gsi1pk,
				":todayEnd": todayEnd,
				":falseValue": false,
			},
			FilterExpression:
				"attribute_not_exists(#deletedAt) AND #completed = :falseValue",
			IndexName: AvailableIndexes.GSI1,
		});

		const results = queryResult ?? [];
		return results.map((dbEntity) => this.mapper.toDomain(dbEntity));
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

	async getTaskCountsByProject(
		projectId: string,
		userId: string,
	): Promise<{ pending: number; completed: number }> {
		const pk = `USER#${userId}#PROJECT#${projectId}`;

		const [pending, completed] = await Promise.all([
			this.dynamoClient.queryCount<TasksDynamoDBEntity>({
				KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
				ExpressionAttributeValues: {
					":pk": pk,
					":skPrefix": "TASK#PENDING#",
				},
				IndexName: undefined,
			}),
			this.dynamoClient.queryCount<TasksDynamoDBEntity>({
				KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
				ExpressionAttributeValues: {
					":pk": pk,
					":skPrefix": "TASK#COMPLETED#",
				},
				IndexName: undefined,
			}),
		]);

		return { pending, completed };
	}

	async getByUserId(
		taskId: string,
		userId: string,
		projectId: string | null | undefined,
	): Promise<Task | null> {
		// Inbox tasks: PK = USER#userId, SK begins_with TASK#INBOX#
		// Project tasks: PK = USER#userId#PROJECT#projectId, SK begins_with TASK#
		const pk = projectId
			? `USER#${userId}#PROJECT#${projectId}`
			: `USER#${userId}`;
		const skPrefix = projectId ? "TASK#" : "TASK#INBOX#";

		const queryResult = await this.dynamoClient.query<TasksDynamoDBEntity[]>({
			KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
			ExpressionAttributeNames: {
				"#id": "id",
			},
			ExpressionAttributeValues: {
				":pk": pk,
				":skPrefix": skPrefix,
				":taskId": taskId,
			},
			FilterExpression: "#id = :taskId",
			IndexName: undefined,
		});

		const results = queryResult ? queryResult : [];
		if (results.length === 0) return null;

		const first = results[0];
		return first ? this.mapper.toDomain(first) : null;
	}

	async updateCompletion(oldTask: Task, updatedTask: Task): Promise<Task> {
		const oldDbEntity = this.mapper.toDatabase(oldTask);
		const newDbEntity = this.mapper.toDatabase(updatedTask);

		await this.dynamoClient.transactWrite([
			{ Delete: { Key: { PK: oldDbEntity.PK, SK: oldDbEntity.SK } } },
			{ Put: { Item: newDbEntity } },
		]);

		return updatedTask;
	}

	async updateTask(
		task: Task,
		updates: Partial<
			Pick<
				Task,
				| "title"
				| "description"
				| "priority"
				| "dueDate"
				| "recurrence"
				| "sectionId"
				| "projectId"
				| "updatedAt"
			>
		>,
	): Promise<Task> {
		const updatedTask: Task = { ...task, ...updates };

		// If projectId is changing the PK changes, so we must delete+put
		if ("projectId" in updates && updates.projectId !== task.projectId) {
			const oldDbEntity = this.mapper.toDatabase(task);
			const newDbEntity = this.mapper.toDatabase(updatedTask);

			await this.dynamoClient.transactWrite([
				{ Delete: { Key: { PK: oldDbEntity.PK, SK: oldDbEntity.SK } } },
				{ Put: { Item: newDbEntity } },
			]);

			return updatedTask;
		}

		// Same PK: use UpdateItem to patch only changed fields
		const oldDbEntity = this.mapper.toDatabase(task);
		const { parts, names, values } = this.buildUpdateExpression(updates);

		if (parts.length > 0) {
			await this.dynamoClient.update({
				Key: { PK: oldDbEntity.PK, SK: oldDbEntity.SK },
				UpdateExpression: `SET ${parts.join(", ")}`,
				ExpressionAttributeNames: names,
				ExpressionAttributeValues: values,
			});
		}

		return updatedTask;
	}

	private static readonly DOMAIN_TO_DB_FIELD: Record<string, string> = {
		title: "title",
		description: "description",
		priority: "priority",
		dueDate: "due_date",
		recurrence: "recurrence",
		sectionId: "section_id",
		updatedAt: "updated_at",
	};

	private static readonly DATE_FIELDS = new Set(["dueDate", "updatedAt"]);

	private serializeFieldValue(field: string, raw: unknown): unknown {
		if (!TasksDynamoRepository.DATE_FIELDS.has(field)) {
			return raw ?? null;
		}
		if (field === "updatedAt") {
			return raw
				? new Date(raw as string).toISOString()
				: new Date().toISOString();
		}
		return raw ? new Date(raw as string).toISOString() : null;
	}

	private buildUpdateExpression(updates: Record<string, unknown>): {
		parts: string[];
		names: Record<string, string>;
		values: Record<string, unknown>;
	} {
		const parts: string[] = [];
		const names: Record<string, string> = {};
		const values: Record<string, unknown> = {};

		for (const [domainField, dbField] of Object.entries(
			TasksDynamoRepository.DOMAIN_TO_DB_FIELD,
		)) {
			if (!(domainField in updates)) continue;

			const nameAlias = `#${dbField}`;
			const valueAlias = `:${dbField}`;
			names[nameAlias] = dbField;
			values[valueAlias] = this.serializeFieldValue(
				domainField,
				updates[domainField],
			);
			parts.push(`${nameAlias} = ${valueAlias}`);
		}

		// Always update updated_at if not explicitly provided
		if (!("updatedAt" in updates)) {
			names["#updated_at"] = "updated_at";
			values[":updated_at"] = new Date().toISOString();
			parts.push("#updated_at = :updated_at");
		}

		return { parts, names, values };
	}

	async updateField(
		taskId: string,
		userId: string,
		projectId: string | null,
		field: string,
		value: unknown,
	): Promise<void> {
		// We need the PK and SK to update the item. Find the task first to get its SK.
		const task = await this.getByUserId(taskId, userId, projectId);
		if (!task) {
			return;
		}

		const dbEntity = this.mapper.toDatabase(task);

		await this.dynamoClient.update({
			Key: { PK: dbEntity.PK, SK: dbEntity.SK },
			UpdateExpression: "SET #field = :value",
			ExpressionAttributeNames: { "#field": field },
			ExpressionAttributeValues: { ":value": value },
		});
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
