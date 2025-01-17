import { dynamoClient } from "@application/libs/dynamo";

export function makeDynamoClient() {
	return dynamoClient;
}
