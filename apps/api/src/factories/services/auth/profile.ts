import {
	IProfileService,
	ProfileService,
} from "@application/modules/auth/services/profile";
import { makeUserDynamoRepository } from "@infra/db/dynamodb/factories/user-repository-factory";

export function makeProfileService(): IProfileService {
	const userRepository = makeUserDynamoRepository();
	return new ProfileService(userRepository);
}
