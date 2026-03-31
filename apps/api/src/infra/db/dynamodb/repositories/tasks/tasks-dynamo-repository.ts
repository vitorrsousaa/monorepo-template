import type { TasksMapper } from "@data/protocols/tasks/tasks-mapper";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks";
import type { IDatabaseClient } from "../../contracts/client";
import { AvailableIndexes } from "../../contracts/entity";
import type { TasksDynamoDBEntity } from "../../mappers/tasks/types";

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
		const oldDbEntity = this.mapper.toDatabase(task);
		const newDbEntity = this.mapper.toDatabase(updatedTask);

		const keysChanged =
			oldDbEntity.PK !== newDbEntity.PK || oldDbEntity.SK !== newDbEntity.SK;

		// If projectId is changing the PK changes, so we must delete+put
		if (keysChanged) {
			await this.dynamoClient.transactWrite([
				{ Delete: { Key: { PK: oldDbEntity.PK, SK: oldDbEntity.SK } } },
				{ Put: { Item: newDbEntity } },
			]);

			return updatedTask;
		}

		// Same PK: use UpdateItem to patch only changed fields
		const { expression, names, values } = this.buildUpdateExpression(
			updates,
			newDbEntity,
		);

		if (expression) {
			await this.dynamoClient.update({
				Key: { PK: oldDbEntity.PK, SK: oldDbEntity.SK },
				UpdateExpression: expression,
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

	private buildUpdateExpression(
		updates: Record<string, unknown>,
		newDbEntity: TasksDynamoDBEntity,
	): {
		expression: string;
		names: Record<string, string>;
		values: Record<string, unknown>;
	} {
		const setParts: string[] = [];
		const removeParts: string[] = [];
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
			setParts.push(`${nameAlias} = ${valueAlias}`);
		}

		if (!("updatedAt" in updates)) {
			names["#updated_at"] = "updated_at";
			values[":updated_at"] = new Date().toISOString();
			setParts.push("#updated_at = :updated_at");
		}

		if (newDbEntity.GSI1PK != null && newDbEntity.GSI1SK != null) {
			names["#GSI1PK"] = "GSI1PK";
			values[":GSI1PK"] = newDbEntity.GSI1PK;
			setParts.push("#GSI1PK = :GSI1PK");

			names["#GSI1SK"] = "GSI1SK";
			values[":GSI1SK"] = newDbEntity.GSI1SK;
			setParts.push("#GSI1SK = :GSI1SK");
		} else {
			names["#GSI1PK"] = "GSI1PK";
			names["#GSI1SK"] = "GSI1SK";
			removeParts.push("#GSI1PK", "#GSI1SK");
		}

		const clauses: string[] = [];
		if (setParts.length > 0) clauses.push(`SET ${setParts.join(", ")}`);
		if (removeParts.length > 0)
			clauses.push(`REMOVE ${removeParts.join(", ")}`);

		return { expression: clauses.join(" "), names, values };
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
}
