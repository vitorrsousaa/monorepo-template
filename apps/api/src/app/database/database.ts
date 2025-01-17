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
	type QueryCommandInput,
	ScanCommand,
	type ScanCommandInput,
	// TransactionWriteCommand
	TransactWriteCommand,
	type TransactWriteCommandInput,
	UpdateCommand,
	type UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { TBaseEntity, TIndexes } from "./entities";
import { DATABASE_TABLE } from "./table";

export interface IDatabaseClient {
	create<T extends TBaseEntity>(attributes: T): Promise<void>;
	update(args: Omit<UpdateCommandInput, "TableName">): Promise<void>;
	query<T>(
		args: Omit<QueryCommandInput, "TableName" | "IndexName"> & {
			IndexName?: TIndexes;
		},
	): Promise<T | undefined>;
	scan<T>(
		args: Omit<ScanCommandInput, "TableName" | "IndexName"> & {
			IndexName?: TIndexes;
		},
	): Promise<T | undefined>;
	get<T>(args: Omit<GetCommandInput, "TableName">): Promise<T | undefined>;
	delete(args: Omit<DeleteCommandInput, "TableName">): Promise<void>;
	transactWrite(args: TransactWriteCommandInput): Promise<void>;
	batchWrite(args: BatchWriteCommandInput): Promise<void>;
}

export class DatabaseClient implements IDatabaseClient {
	private TABLE_NAME = DATABASE_TABLE.TABLE_NAME;

	constructor(private readonly dynamoClient: DynamoDBDocumentClient) {}

	async batchWrite(args: BatchWriteCommandInput): Promise<void> {
		const command = new BatchWriteCommand({ ...args });

		await this.dynamoClient.send(command);
	}
	async transactWrite(args: TransactWriteCommandInput): Promise<void> {
		const command = new TransactWriteCommand({ ...args });

		await this.dynamoClient.send(command);
	}

	async create<T extends TBaseEntity>(attributes: T) {
		const command = new PutCommand({
			TableName: this.TABLE_NAME,
			Item: {
				...attributes,
			},
		});

		await this.dynamoClient.send(command);
	}

	async delete(args: Omit<DeleteCommandInput, "TableName">) {
		const command = new DeleteCommand({
			TableName: this.TABLE_NAME,
			...args,
		});

		await this.dynamoClient.send(command);
	}

	async update(args: Omit<UpdateCommandInput, "TableName">) {
		const updateCommand = new UpdateCommand({
			TableName: this.TABLE_NAME,
			...args,
		});

		await this.dynamoClient.send(updateCommand);
	}

	async query<T>(
		args: Omit<QueryCommandInput, "TableName">,
	): Promise<T | undefined> {
		const command = new QueryCommand({
			TableName: this.TABLE_NAME,
			...args,
		});

		const { Items } = await this.dynamoClient.send(command);

		return Items as T | undefined;
	}

	async scan<T>(
		args: Omit<ScanCommandInput, "TableName">,
	): Promise<T | undefined> {
		const command = new ScanCommand({
			TableName: this.TABLE_NAME,
			...args,
		});

		const { Items } = await this.dynamoClient.send(command);

		return Items as T | undefined;
	}

	async get<T>(
		args: Omit<GetCommandInput, "TableName">,
	): Promise<T | undefined> {
		const command = new GetCommand({
			TableName: this.TABLE_NAME,
			...args,
		});

		const { Item } = await this.dynamoClient.send(command);

		return Item as T | undefined;
	}
}
