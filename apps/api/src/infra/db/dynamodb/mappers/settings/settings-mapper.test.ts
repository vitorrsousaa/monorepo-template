import type { UserSettings } from "@repo/contracts/settings/entities";
import { UserSettingsDynamoMapper } from "./settings-mapper";
import type { UserSettingsDynamoDBEntity } from "./types";

describe("UserSettingsDynamoMapper", () => {
	const mapper = new UserSettingsDynamoMapper();

	const sampleDomain: UserSettings = {
		id: "u-1",
		userId: "u-1",
		settings: { preferences: { language: "pt" } },
		createdAt: "2024-06-01T00:00:00.000Z",
		updatedAt: "2024-06-02T00:00:00.000Z",
		deletedAt: null,
	};

	describe("toDomain", () => {
		it("should convert DynamoDB entity to UserSettings", () => {
			const dbEntity: UserSettingsDynamoDBEntity = {
				PK: "USER#u-1#SETTINGS",
				SK: "SETTINGS",
				id: "u-1",
				user_id: "u-1",
				settings: { preferences: { language: "en" } },
				entity_type: "USER_SETTINGS",
				created_at: "2024-06-01T00:00:00.000Z",
				updated_at: "2024-06-02T00:00:00.000Z",
				deleted_at: null,
			};

			expect(mapper.toDomain(dbEntity)).toEqual({
				id: "u-1",
				userId: "u-1",
				settings: { preferences: { language: "en" } },
				createdAt: "2024-06-01T00:00:00.000Z",
				updatedAt: "2024-06-02T00:00:00.000Z",
				deletedAt: undefined,
			});
		});
	});

	describe("toDatabase", () => {
		it("should build PK USER#userId#SETTINGS and SK SETTINGS", () => {
			const result = mapper.toDatabase(sampleDomain);

			expect(result.PK).toBe("USER#u-1#SETTINGS");
			expect(result.SK).toBe("SETTINGS");
		});

		it("should set entity_type to USER_SETTINGS", () => {
			const result = mapper.toDatabase(sampleDomain);

			expect(result.entity_type).toBe("USER_SETTINGS");
		});

		it("should map user_id and nested settings", () => {
			const result = mapper.toDatabase(sampleDomain);

			expect(result.user_id).toBe("u-1");
			expect(result.settings.preferences.language).toBe("pt");
		});
	});

	describe("roundtrip", () => {
		it("should preserve id, userId, and settings", () => {
			const dbEntity = mapper.toDatabase(sampleDomain);
			const back = mapper.toDomain(dbEntity);

			expect(back.id).toBe(sampleDomain.id);
			expect(back.userId).toBe(sampleDomain.userId);
			expect(back.settings).toEqual(sampleDomain.settings);
		});
	});
});
