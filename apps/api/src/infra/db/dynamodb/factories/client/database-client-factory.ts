import { makeDatabaseTable } from "@factories/database-table";
import { makeDynamoClient } from "@factories/libs/dynamo";
import { DatabaseClient } from "@infra/db/dynamodb/client/dynamo";
import { IDatabaseClient } from "@infra/db/dynamodb/contracts/client";

export function makeDatabaseClient(): IDatabaseClient {
	const dynamoClient = makeDynamoClient();
	const table = makeDatabaseTable();
	return new DatabaseClient(table, dynamoClient);
}
