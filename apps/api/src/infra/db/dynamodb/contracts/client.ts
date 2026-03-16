import {
	DeleteCommandInput,
	GetCommandInput,
	UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { BaseDynamoDBEntity } from "./entity";

export type IDatabaseClientGetArgs = Omit<GetCommandInput, "TableName">;

export interface IDatabaseClient {
	create<T extends BaseDynamoDBEntity>(attributes: T): Promise<void>;
	update(args: Omit<UpdateCommandInput, "TableName">): Promise<void>;
	// query<T>(
	// 	args: Omit<QueryCommandInput, "TableName" | "IndexName"> & {
	// 		IndexName?: TIndexes;
	// 	},
	// ): Promise<T | undefined>;
	get<T>(args: IDatabaseClientGetArgs): Promise<T | undefined>;
	delete(args: Omit<DeleteCommandInput, "TableName">): Promise<void>;
}
