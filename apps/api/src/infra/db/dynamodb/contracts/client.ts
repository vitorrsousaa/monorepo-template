import {
	DeleteCommandInput,
	GetCommandInput,
	QueryCommandInput,
	UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { BaseDynamoDBEntity, ValidIndexName } from "./entity";

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

export interface IDatabaseClient {
	create<T extends BaseDynamoDBEntity>(attributes: T): Promise<void>;
	update(args: Omit<UpdateCommandInput, "TableName">): Promise<void>;
	query<T>(args: IDatabaseClientQueryArgs<T>): Promise<T | undefined>;
	get<T>(args: IDatabaseClientGetArgs): Promise<T | undefined>;
	delete(args: Omit<DeleteCommandInput, "TableName">): Promise<void>;
}
