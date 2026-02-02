import { MOCK_USER_ID } from "@application/config/mock-user";
import type { ProjectDynamoDBEntity } from "@infra/db/dynamodb/mappers/projects/types";
import { MOCK_PROJECT_IDS } from "@infra/db/dynamodb/repositories/mock-ids";

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
		SK: `PROJECT#${MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN}`,
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: `PROJECT#Python Study Plan#${MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN}`,
		id: MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN,
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
		SK: `PROJECT#${MOCK_PROJECT_IDS.AUTOMATED_TESTS}`,
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: `PROJECT#Automated Tests#${MOCK_PROJECT_IDS.AUTOMATED_TESTS}`,
		id: MOCK_PROJECT_IDS.AUTOMATED_TESTS,
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
		SK: `PROJECT#${MOCK_PROJECT_IDS.PERSONAL_GOALS_2025}`,
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: `PROJECT#Personal Goals 2025#${MOCK_PROJECT_IDS.PERSONAL_GOALS_2025}`,
		id: MOCK_PROJECT_IDS.PERSONAL_GOALS_2025,
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
		SK: `PROJECT#${MOCK_PROJECT_IDS.HOME_IMPROVEMENT}`,
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: `PROJECT#Home Improvement#${MOCK_PROJECT_IDS.HOME_IMPROVEMENT}`,
		id: MOCK_PROJECT_IDS.HOME_IMPROVEMENT,
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
		SK: `PROJECT#${MOCK_PROJECT_IDS.FITNESS_JOURNEY}`,
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: `PROJECT#Fitness Journey#${MOCK_PROJECT_IDS.FITNESS_JOURNEY}`,
		id: MOCK_PROJECT_IDS.FITNESS_JOURNEY,
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
		SK: `PROJECT#${MOCK_PROJECT_IDS.OLD_PROJECT_DELETED}`,
		GSI6PK: `USER#${MOCK_USER_ID}`,
		GSI6SK: `PROJECT#Old Project (Deleted)#${MOCK_PROJECT_IDS.OLD_PROJECT_DELETED}`,
		id: MOCK_PROJECT_IDS.OLD_PROJECT_DELETED,
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
