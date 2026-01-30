import { MOCK_USER_ID } from "@application/config/mock-user";
import type { ProjectDynamoDBEntity } from "@infra/db/dynamodb/mappers/projects/types";

/**
 * PROJECT_DYNAMO_MOCKS
 *
 * Mock data for development and testing.
 * Simulates projects stored in DynamoDB with proper PK/SK structure.
 *
 * Structure per docs/database-design.md:
 * - PK = USER#userId
 * - SK = PROJECT#projectId
 * - GSI6PK = USER#userId (for listing by user)
 * - GSI6SK = PROJECT#name#projectId (for alphabetical ordering)
 */

const now = new Date();

export const PROJECT_DYNAMO_MOCKS: ProjectDynamoDBEntity[] = [
	{
		PK: `USER#${MOCK_USER_ID}`,
		SK: "PROJECT#proj-001",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Python Study Plan#proj-001",
		id: "proj-001",
		user_id: MOCK_USER_ID,
		name: "Python Study Plan",
		description: "Detailed plan to learn Python step by step",
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "PROJECT",
	},
	{
		PK: `USER#${MOCK_USER_ID}`,
		SK: "PROJECT#proj-002",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Automated Tests#proj-002",
		id: "proj-002",
		user_id: MOCK_USER_ID,
		name: "Automated Tests",
		description: "Learn and implement automated testing",
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 20 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "PROJECT",
	},
	{
		PK: `USER#${MOCK_USER_ID}`,
		SK: "PROJECT#proj-003",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Personal Goals 2025#proj-003",
		id: "proj-003",
		user_id: MOCK_USER_ID,
		name: "Personal Goals 2025",
		description: "My goals and objectives for 2025",
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 15 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "PROJECT",
	},
	{
		PK: `USER#${MOCK_USER_ID}`,
		SK: "PROJECT#proj-004",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Home Improvement#proj-004",
		id: "proj-004",
		user_id: MOCK_USER_ID,
		name: "Home Improvement",
		description: "Tasks and projects for home improvements",
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 10 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: now.toISOString(),
		entity_type: "PROJECT",
	},
	{
		PK: `USER#${MOCK_USER_ID}`,
		SK: "PROJECT#proj-005",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Fitness Journey#proj-005",
		id: "proj-005",
		user_id: MOCK_USER_ID,
		name: "Fitness Journey",
		description: "Workout plans and health tracking",
		deleted_at: null,
		created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
		entity_type: "PROJECT",
	},
	{
		PK: `USER#${MOCK_USER_ID}`,
		SK: "PROJECT#proj-006",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Old Project (Deleted)#proj-006",
		id: "proj-006",
		user_id: MOCK_USER_ID,
		name: "Old Project (Deleted)",
		description:
			"This project was deleted and should not appear in active lists",
		deleted_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		created_at: new Date(
			now.getTime() - 60 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "PROJECT",
	},
];
