import type { UserSettingsMapper } from "@data/protocols/settings/settings-mapper";
import type { UserSettings } from "@repo/contracts/settings/entities";
import type { UserSettingsDynamoDBEntity } from "./types";

const USER_PREFIX = "USER#";

function buildPK(userId: string): string {
	return `${USER_PREFIX}${userId}#SETTINGS`;
}

function buildSK(): string {
	return "SETTINGS";
}

export class UserSettingsDynamoMapper
	implements UserSettingsMapper<UserSettingsDynamoDBEntity>
{
	/**
	 * Maps DynamoDB entity to contract shape (camelCase, no PK/SK).
	 */
	toDomain(dbEntity: UserSettingsDynamoDBEntity): UserSettings {
		return {
			id: dbEntity.id,
			userId: dbEntity.user_id,
			settings: {
				preferences: {
					language: dbEntity.settings.preferences.language,
				},
			},
			createdAt: new Date(dbEntity.created_at).toISOString(),
			updatedAt: new Date(dbEntity.updated_at).toISOString(),
			deletedAt: dbEntity.deleted_at
				? new Date(dbEntity.deleted_at).toISOString()
				: undefined,
		};
	}

	/**
	 * Maps domain/contract entity to DynamoDB item (PK/SK, snake_case, ISO dates).
	 * Timestamps: `UserSettings` has no dates in the contract; callers that need a
	 * stable `created_at` on update should merge with the existing item in the repository.
	 */
	toDatabase(userSettings: UserSettings): UserSettingsDynamoDBEntity {
		const now = new Date().toISOString();

		return {
			PK: buildPK(userSettings.userId),
			SK: buildSK(),
			id: userSettings.id,
			user_id: userSettings.userId,
			settings: {
				preferences: {
					language: userSettings.settings.preferences.language,
				},
			},
			entity_type: "USER_SETTINGS",
			created_at: userSettings.createdAt,
			updated_at: userSettings.updatedAt,
			deleted_at: userSettings.deletedAt,
		};
	}
}
