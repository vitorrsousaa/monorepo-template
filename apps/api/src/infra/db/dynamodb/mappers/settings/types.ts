import { BaseDynamoDBEntity } from "../../contracts/entity";

/**
 * UserSettingsDynamoDBEntity
 *
 * Represents the UserSettings entity structure in DynamoDB.
 * Aligned with docs/database-design.md.
 *
 * PK = USER#userId#SETTINGS
 * SK = SETTINGS
 */
export interface UserSettingsDynamoDBEntity extends BaseDynamoDBEntity {
	// Partition Key: scoped by user
	PK: string; // USER#userId#SETTINGS
	SK: string; // SETTINGS

	// Entity attributes (snake_case)
	user_id: string;
	settings: {
		preferences: {
			language: "pt" | "en";
		};
	};
}
