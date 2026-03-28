import type { UserSettings } from "@repo/contracts/settings/entities";

export interface GetUserSettingsInput {
	userId: string;
}

export interface GetUserSettingsOutput {
	settings: UserSettings;
}
