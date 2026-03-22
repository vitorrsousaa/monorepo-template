import {
	CreateTableCommand,
	DeleteTableCommand,
	DynamoDBClient,
	ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
	BatchWriteCommand,
	DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "artemis-data-test";
const ENDPOINT = "http://localhost:8000";

const rawClient = new DynamoDBClient({
	endpoint: ENDPOINT,
	region: "local",
	credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

const docClient = DynamoDBDocumentClient.from(rawClient);

async function createTable() {
	try {
		await rawClient.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
	} catch {
		// table doesn't exist yet
	}

	await rawClient.send(
		new CreateTableCommand({
			TableName: TABLE_NAME,
			KeySchema: [
				{ AttributeName: "PK", KeyType: "HASH" },
				{ AttributeName: "SK", KeyType: "RANGE" },
			],
			AttributeDefinitions: [
				{ AttributeName: "PK", AttributeType: "S" },
				{ AttributeName: "SK", AttributeType: "S" },
				{ AttributeName: "GSI1PK", AttributeType: "S" },
				{ AttributeName: "GSI1SK", AttributeType: "S" },
				{ AttributeName: "GSI3PK", AttributeType: "S" },
				{ AttributeName: "GSI3SK", AttributeType: "S" },
				{ AttributeName: "GSI6PK", AttributeType: "S" },
				{ AttributeName: "GSI6SK", AttributeType: "S" },
			],
			GlobalSecondaryIndexes: [
				{
					IndexName: "GSI1",
					KeySchema: [
						{ AttributeName: "GSI1PK", KeyType: "HASH" },
						{ AttributeName: "GSI1SK", KeyType: "RANGE" },
					],
					Projection: { ProjectionType: "ALL" },
				},
				{
					IndexName: "GSI3",
					KeySchema: [
						{ AttributeName: "GSI3PK", KeyType: "HASH" },
						{ AttributeName: "GSI3SK", KeyType: "RANGE" },
					],
					Projection: { ProjectionType: "ALL" },
				},
				{
					IndexName: "GSI6",
					KeySchema: [
						{ AttributeName: "GSI6PK", KeyType: "HASH" },
						{ AttributeName: "GSI6SK", KeyType: "RANGE" },
					],
					Projection: { ProjectionType: "ALL" },
				},
			],
			BillingMode: "PAY_PER_REQUEST",
		}),
	);
}

async function clearTable() {
	const scan = await rawClient.send(
		new ScanCommand({
			TableName: TABLE_NAME,
			ProjectionExpression: "PK, SK",
		}),
	);

	const items = scan.Items ?? [];
	if (items.length === 0) return;

	const batches: (typeof items)[] = [];
	for (let i = 0; i < items.length; i += 25) {
		batches.push(items.slice(i, i + 25));
	}

	for (const batch of batches) {
		await docClient.send(
			new BatchWriteCommand({
				RequestItems: {
					[TABLE_NAME]: batch.map((item) => ({
						DeleteRequest: {
							Key: { PK: item.PK?.S ?? "", SK: item.SK?.S ?? "" },
						},
					})),
				},
			}),
		);
	}
}

export function createTestDynamoClient() {
	return { rawClient, docClient, tableName: TABLE_NAME };
}

beforeAll(async () => {
	await createTable();
});

beforeEach(async () => {
	await clearTable();
});
