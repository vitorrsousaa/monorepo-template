import type {
	DeleteCommandInput,
	GetCommandInput,
	QueryCommandInput,
	TransactWriteCommandInput,
	UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { BaseDynamoDBEntity, ValidIndexName } from "./entity";

export type IDatabaseClientGetArgs = Omit<GetCommandInput, "TableName">;

/**
 * Query arguments with type-safe index names.
 * Only indexes defined in AvailableIndexes are allowed.
 */
export type IDatabaseClientQueryArgs<T> = Omit<
	QueryCommandInput,
	"TableName" | "IndexName"
> & {
	IndexName?: ValidIndexName;
};

/**
 * A single item in a transact write operation.
 * TableName is omitted — the client injects it automatically for each item,
 * keeping the repository unaware of the physical table name.
 */
export type TransactWriteItem = {
	Put?: Omit<
		NonNullable<
			NonNullable<TransactWriteCommandInput["TransactItems"]>[number]["Put"]
		>,
		"TableName"
	>;
	Delete?: Omit<
		NonNullable<
			NonNullable<TransactWriteCommandInput["TransactItems"]>[number]["Delete"]
		>,
		"TableName"
	>;
	Update?: Omit<
		NonNullable<
			NonNullable<TransactWriteCommandInput["TransactItems"]>[number]["Update"]
		>,
		"TableName"
	>;
};

export interface IDatabaseClient {
	create<T extends BaseDynamoDBEntity>(attributes: T): Promise<void>;
	update(args: Omit<UpdateCommandInput, "TableName">): Promise<void>;
	query<T>(args: IDatabaseClientQueryArgs<T>): Promise<T | undefined>;
	queryCount<T>(args: IDatabaseClientQueryArgs<T>): Promise<number>;
	get<T>(args: IDatabaseClientGetArgs): Promise<T | undefined>;
	delete(args: Omit<DeleteCommandInput, "TableName">): Promise<void>;
	/**
	 * Executes multiple write operations atomically.
	 * TableName is injected automatically for each item.
	 */
	transactWrite(items: TransactWriteItem[]): Promise<void>;
}
