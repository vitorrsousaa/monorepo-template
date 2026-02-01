import { MOCK_USER_ID } from "@application/config/mock-user";
import type { SectionDynamoDBEntity } from "@infra/db/dynamodb/mappers/sections/types";

/**
 * SECTION_DYNAMO_MOCKS
 *
 * Mock data for development and testing.
 * Simulates sections stored in DynamoDB with proper PK/SK structure.
 *
 * Structure per docs/database-design.md:
 * - PK = USER#userId#PROJECT#projectId
 * - SK = SECTION#sectionId
 *
 * Relacionamentos:
 * - Python Study Plan (a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8) tem 3 sections
 * - Personal Goals 2025 (c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0) tem 3 sections
 * - Home Improvement (d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1) tem 2 sections
 */

const now = new Date();

// Project IDs from project-dynamo-repository-mocks.ts
const PYTHON_PROJECT_ID = "a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8";
const PERSONAL_GOALS_PROJECT_ID = "c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0";
const HOME_IMPROVEMENT_PROJECT_ID = "d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1";

export const SECTION_DYNAMO_MOCKS: SectionDynamoDBEntity[] = [
	// ========== Python Study Plan (3 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${PYTHON_PROJECT_ID}`,
		SK: "SECTION#sec-python-001",
		id: "sec-python-001",
		user_id: MOCK_USER_ID,
		project_id: PYTHON_PROJECT_ID,
		name: "Backlog",
		description: "Topics and modules to learn",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${PYTHON_PROJECT_ID}`,
		SK: "SECTION#sec-python-002",
		id: "sec-python-002",
		user_id: MOCK_USER_ID,
		project_id: PYTHON_PROJECT_ID,
		name: "In Progress",
		description: "Currently studying",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${PYTHON_PROJECT_ID}`,
		SK: "SECTION#sec-python-003",
		id: "sec-python-003",
		user_id: MOCK_USER_ID,
		project_id: PYTHON_PROJECT_ID,
		name: "Completed",
		description: "Finished modules",
		order: 3,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},

	// ========== Personal Goals 2025 (3 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${PERSONAL_GOALS_PROJECT_ID}`,
		SK: "SECTION#sec-goals-001",
		id: "sec-goals-001",
		user_id: MOCK_USER_ID,
		project_id: PERSONAL_GOALS_PROJECT_ID,
		name: "Health & Fitness",
		description: "Physical and mental health goals",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 15 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${PERSONAL_GOALS_PROJECT_ID}`,
		SK: "SECTION#sec-goals-002",
		id: "sec-goals-002",
		user_id: MOCK_USER_ID,
		project_id: PERSONAL_GOALS_PROJECT_ID,
		name: "Career & Learning",
		description: "Professional development goals",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 15 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${PERSONAL_GOALS_PROJECT_ID}`,
		SK: "SECTION#sec-goals-003",
		id: "sec-goals-003",
		user_id: MOCK_USER_ID,
		project_id: PERSONAL_GOALS_PROJECT_ID,
		name: "Personal & Social",
		description: "Relationships and personal growth",
		order: 3,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 15 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},

	// ========== Home Improvement (2 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${HOME_IMPROVEMENT_PROJECT_ID}`,
		SK: "SECTION#sec-home-001",
		id: "sec-home-001",
		user_id: MOCK_USER_ID,
		project_id: HOME_IMPROVEMENT_PROJECT_ID,
		name: "To Do",
		description: "Pending home tasks",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 10 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: now.toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${HOME_IMPROVEMENT_PROJECT_ID}`,
		SK: "SECTION#sec-home-002",
		id: "sec-home-002",
		user_id: MOCK_USER_ID,
		project_id: HOME_IMPROVEMENT_PROJECT_ID,
		name: "Done",
		description: "Completed home improvements",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 10 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
];
