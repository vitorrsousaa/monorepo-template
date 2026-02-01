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
		SK: "PROJECT#a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Python Study Plan#a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8",
		id: "a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8",
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
		SK: "PROJECT#b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Automated Tests#b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9",
		id: "b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9",
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
		SK: "PROJECT#c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Personal Goals 2025#c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0",
		id: "c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0",
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
		SK: "PROJECT#d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Home Improvement#d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1",
		id: "d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1",
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
		SK: "PROJECT#e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: "PROJECT#Fitness Journey#e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2",
		id: "e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2",
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
		SK: "PROJECT#f6a7b8c9-d0e1-4234-f6a7-b8c9d0e1f2a3",
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK:
			"PROJECT#Old Project (Deleted)#f6a7b8c9-d0e1-4234-f6a7-b8c9d0e1f2a3",
		id: "f6a7b8c9-d0e1-4234-f6a7-b8c9d0e1f2a3",
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
