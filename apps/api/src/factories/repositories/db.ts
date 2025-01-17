import { DatabaseClient } from "@application/database/database";
import { makeDynamoClient } from "@factories/libs/dynamo";

export function makeDatabaseClient() {
	return new DatabaseClient(makeDynamoClient());
}
