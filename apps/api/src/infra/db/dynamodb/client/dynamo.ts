import type { IDatabaseTable } from "@application/config/tables";
import {
	BatchWriteCommand,
	type BatchWriteCommandInput,
	DeleteCommand,
	type DeleteCommandInput,
	type DynamoDBDocumentClient,
	GetCommand,
	type GetCommandInput,
	PutCommand,
	QueryCommand,
	QueryCommandInput,
	TransactWriteCommand,
	TransactWriteCommandInput,
	UpdateCommand,
	type UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type {
	IDatabaseClient,
	IDatabaseClientQueryArgs,
	TransactWriteItem,
} from "../contracts/client";
import type { BaseDynamoDBEntity } from "../contracts/entity";

export class DatabaseClient implements IDatabaseClient {
	constructor(
		private readonly table: IDatabaseTable,
		private readonly dynamoClient: DynamoDBDocumentClient,
	) {}
	async batchWrite(args: BatchWriteCommandInput): Promise<void> {
		const command = new BatchWriteCommand({ ...args });
		await this.dynamoClient.send(command);
	}

	async transactWrite(items: TransactWriteItem[]): Promise<void> {
		const command = new TransactWriteCommand({
			TransactItems: items.map((item) => ({
				...(item.Put && {
					Put: { TableName: this.table.TABLE_NAME, ...item.Put },
				}),
				...(item.Delete && {
					Delete: { TableName: this.table.TABLE_NAME, ...item.Delete },
				}),
				...(item.Update && {
					Update: { TableName: this.table.TABLE_NAME, ...item.Update },
				}),
			})),
		});
		await this.dynamoClient.send(command);
	}

	async create<T extends BaseDynamoDBEntity>(attributes: T) {
		const command = new PutCommand({
			TableName: this.table.TABLE_NAME,
			Item: {
				...attributes,
			},
		});

		await this.dynamoClient.send(command);
	}

	async delete(args: Omit<DeleteCommandInput, "TableName">) {
		const command = new DeleteCommand({
			TableName: this.table.TABLE_NAME,
			...args,
		});

		await this.dynamoClient.send(command);
	}

	async update(args: Omit<UpdateCommandInput, "TableName">) {
		const updateCommand = new UpdateCommand({
			TableName: this.table.TABLE_NAME,
			...args,
		});

		await this.dynamoClient.send(updateCommand);
	}

	async query<T>(args: IDatabaseClientQueryArgs<T>): Promise<T | undefined> {
		const command = new QueryCommand({
			TableName: this.table.TABLE_NAME,
			IndexName: args.IndexName ? args.IndexName : undefined,
			...args,
		});

		const { Items } = await this.dynamoClient.send(command);

		return Items as T | undefined;
	}

	async queryCount<T>(args: IDatabaseClientQueryArgs<T>): Promise<number> {
		const command = new QueryCommand({
			TableName: this.table.TABLE_NAME,
			IndexName: args.IndexName ? args.IndexName : undefined,
			...args,
			Select: "COUNT",
		});
		const { Count } = await this.dynamoClient.send(command);
		return Count ?? 0;
	}

	async get<T>(
		args: Omit<GetCommandInput, "TableName">,
	): Promise<T | undefined> {
		const command = new GetCommand({
			TableName: this.table.TABLE_NAME,
			...args,
		});

		const { Item } = await this.dynamoClient.send(command);

		return Item as T | undefined;
	}
}
