import type { UserSettings } from "@repo/contracts/settings/entities";

export interface UserSettingsMapper<TDBEntity = unknown> {
	toDomain(dbEntity: TDBEntity): UserSettings;
	toDatabase(userSettings: UserSettings): TDBEntity;
}
