/**
 * Shared project IDs for DynamoDB mocks.
 * Use these in both project-dynamo-repository-mocks and section-dynamo-repository-mocks
 * so IDs stay in sync and every project has sections when testing.
 */
export const MOCK_PROJECT_IDS = {
	PYTHON_STUDY_PLAN: "a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8",
	AUTOMATED_TESTS: "b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9",
	PERSONAL_GOALS_2025: "c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0",
	HOME_IMPROVEMENT: "d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1",
	FITNESS_JOURNEY: "e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2",
	OLD_PROJECT_DELETED: "f6a7b8c9-d0e1-4234-f6a7-b8c9d0e1f2a3",
} as const;
