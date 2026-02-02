import { MOCK_USER_ID } from "@application/config/mock-user";
import type { SectionDynamoDBEntity } from "@infra/db/dynamodb/mappers/sections/types";
import { MOCK_PROJECT_IDS } from "@infra/db/dynamodb/repositories/mock-ids";

/**
 * SECTION_DYNAMO_MOCKS
 *
 * Mock data for development and testing.
 * Simulates sections stored in DynamoDB with proper PK/SK structure.
 * Project IDs must match project-dynamo-repository-mocks (via MOCK_PROJECT_IDS).
 *
 * Structure per docs/database-design.md:
 * - PK = USER#userId#PROJECT#projectId
 * - SK = SECTION#sectionId
 */

const now = new Date();

export const SECTION_DYNAMO_MOCKS: SectionDynamoDBEntity[] = [
	// ========== Python Study Plan (3 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN}`,
		SK: "SECTION#sec-python-001",
		id: "sec-python-001",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN,
		name: "Backlog",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN}`,
		SK: "SECTION#sec-python-002",
		id: "sec-python-002",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN,
		name: "In Progress",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN}`,
		SK: "SECTION#sec-python-003",
		id: "sec-python-003",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.PYTHON_STUDY_PLAN,
		name: "Completed",
		order: 3,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},

	// ========== Automated Tests (2 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.AUTOMATED_TESTS}`,
		SK: "SECTION#sec-tests-001",
		id: "sec-tests-001",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.AUTOMATED_TESTS,
		name: "To Do",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 20 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.AUTOMATED_TESTS}`,
		SK: "SECTION#sec-tests-002",
		id: "sec-tests-002",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.AUTOMATED_TESTS,
		name: "Done",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 20 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},

	// ========== Personal Goals 2025 (3 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.PERSONAL_GOALS_2025}`,
		SK: "SECTION#sec-goals-001",
		id: "sec-goals-001",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.PERSONAL_GOALS_2025,
		name: "Health & Fitness",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 15 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.PERSONAL_GOALS_2025}`,
		SK: "SECTION#sec-goals-002",
		id: "sec-goals-002",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.PERSONAL_GOALS_2025,
		name: "Career & Learning",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 15 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.PERSONAL_GOALS_2025}`,
		SK: "SECTION#sec-goals-003",
		id: "sec-goals-003",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.PERSONAL_GOALS_2025,
		name: "Personal & Social",
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
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.HOME_IMPROVEMENT}`,
		SK: "SECTION#sec-home-001",
		id: "sec-home-001",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.HOME_IMPROVEMENT,
		name: "To Do",
		order: 1,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 10 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: now.toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.HOME_IMPROVEMENT}`,
		SK: "SECTION#sec-home-002",
		id: "sec-home-002",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.HOME_IMPROVEMENT,
		name: "Done",
		order: 2,
		deleted_at: null,
		created_at: new Date(
			now.getTime() - 10 * 24 * 60 * 60 * 1000,
		).toISOString(),
		updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},

	// ========== Fitness Journey (2 sections) ==========
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.FITNESS_JOURNEY}`,
		SK: "SECTION#sec-fitness-001",
		id: "sec-fitness-001",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.FITNESS_JOURNEY,
		name: "Weekly Goals",
		order: 1,
		deleted_at: null,
		created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
	{
		PK: `USER#${MOCK_USER_ID}#PROJECT#${MOCK_PROJECT_IDS.FITNESS_JOURNEY}`,
		SK: "SECTION#sec-fitness-002",
		id: "sec-fitness-002",
		user_id: MOCK_USER_ID,
		project_id: MOCK_PROJECT_IDS.FITNESS_JOURNEY,
		name: "Completed",
		order: 2,
		deleted_at: null,
		created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
		entity_type: "SECTION",
	},
];
