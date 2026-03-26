import { IUserSettingsRepository } from "@data/protocols/settings/settings-repository";
import { makeDatabaseClient } from "@infra/db/dynamodb/factories/client/database-client-factory";
import { UserSettingsDynamoMapper } from "../mappers/settings/settings-mapper";
import { SettingsDynamoRepository } from "../repositories/settings/settings-dynamo-repository";

export function makeSettingsDynamoRepository(): IUserSettingsRepository {
	const mapper = new UserSettingsDynamoMapper();
	const databaseClient = makeDatabaseClient();

	return new SettingsDynamoRepository(databaseClient, mapper);
}
