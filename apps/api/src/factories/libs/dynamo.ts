import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export function makeDynamoClient(): DynamoDBDocumentClient {
	const client = new DynamoDBClient({ region: "us-east-1" });

	const dynamoClient = DynamoDBDocumentClient.from(client);

	return dynamoClient;
}
