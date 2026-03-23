import {
	type IGetAccountInfoService,
	GetAccountInfoService,
} from "@application/modules/auth/services/account-info";
import { makeUserDynamoRepository } from "@infra/db/dynamodb/factories/user-repository-factory";

export function makeGetAccountInfoService(): IGetAccountInfoService {
	const userRepository = makeUserDynamoRepository();
	return new GetAccountInfoService(userRepository);
}
