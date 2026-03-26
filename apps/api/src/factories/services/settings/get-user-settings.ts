import { GetUserSettingsService, IGetUserSettingsService } from "@application/modules/settings/services/get-user-settings";
import { makeSettingsDynamoRepository } from "@infra/db/dynamodb/factories/settings-repository-factory";

export function makeGetUserSettingsService(): IGetUserSettingsService {
	const userSettingsRepository = makeSettingsDynamoRepository();

	return new GetUserSettingsService(userSettingsRepository);
}
