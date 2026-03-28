import type { UserSettingsMapper } from "@data/protocols/settings/settings-mapper";
import type { IUserSettingsRepository } from "@data/protocols/settings/settings-repository";
import type {
	IDatabaseClient,
	IDatabaseClientGetArgs,
} from "@infra/db/dynamodb/contracts/client";
import type { UserSettingsDynamoDBEntity } from "@infra/db/dynamodb/mappers/settings/types";
import type { UserSettings } from "@repo/contracts/settings/entities";
import { randomUUID } from "node:crypto";

/**
 * SettingsDynamoRepository
 *
 * DynamoDB implementation for user settings (single item per user).
 *
 * Access pattern (docs/database-design.md):
 * - Get / create: PK = USER#userId#SETTINGS, SK = SETTINGS
 */
export class SettingsDynamoRepository implements IUserSettingsRepository {
	constructor(
		private readonly dynamoClient: IDatabaseClient,
		private readonly mapper: UserSettingsMapper<UserSettingsDynamoDBEntity>,
	) {}
	async update(
		userId: string,
		data: Partial<UserSettings>,
	): Promise<UserSettings | null> {
		const existing = await this.getByUserId(userId);

		if (!existing) {
			return null;
		}

		const nowIso = new Date().toISOString();

		const updated: UserSettings = {
			...existing,
			settings: data.settings ?? existing.settings,
			updatedAt: nowIso,
		};

		const dbEntity = this.mapper.toDatabase(updated);

		await this.dynamoClient.update({
			Key: {
				PK: `USER#${userId}#SETTINGS`,
				SK: "SETTINGS",
			},
			UpdateExpression: "SET #settings = :settings, #updatedAt = :updatedAt",
			ExpressionAttributeNames: {
				"#settings": "settings",
				"#updatedAt": "updated_at",
			},
			ExpressionAttributeValues: {
				":settings": dbEntity.settings,
				":updatedAt": nowIso,
			},
		});

		return updated;
	}

	async create(
		data: Omit<UserSettings, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<UserSettings> {
		const now = new Date();
		const nowIso = now.toISOString();
		const id = randomUUID();
		const userSettings: UserSettings = {
			id,
			userId: data.userId,
			settings: data.settings,
			createdAt: nowIso,
			updatedAt: nowIso,
			deletedAt: null,
		};

		const dbEntity = this.mapper.toDatabase(userSettings);

		await this.dynamoClient.create(dbEntity);

		return this.mapper.toDomain(dbEntity);
	}

	async getByUserId(userId: string): Promise<UserSettings | null> {
		const getArgs: IDatabaseClientGetArgs = {
			Key: {
				PK: `USER#${userId}#SETTINGS`,
				SK: "SETTINGS",
			},
		};

		const dbEntity =
			await this.dynamoClient.get<UserSettingsDynamoDBEntity>(getArgs);

		if (!dbEntity || dbEntity.deleted_at) {
			return null;
		}

		return this.mapper.toDomain(dbEntity);
	}
}
