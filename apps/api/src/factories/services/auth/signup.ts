import { SignupService } from "@application/modules/auth/services/signup";
import { makeCognitoAuthProvider } from "@infra/auth/cognito/factories/cognito-auth-provider";
import { makeSettingsDynamoRepository } from "@infra/db/dynamodb/factories/settings-repository-factory";
import { makeUserDynamoRepository } from "@infra/db/dynamodb/factories/user-repository-factory";

export function makeSignupService(): SignupService {
	const authProvider = makeCognitoAuthProvider();
	const userRepository = makeUserDynamoRepository();
	const userSettingsRepository = makeSettingsDynamoRepository();
	return new SignupService(authProvider, userRepository, userSettingsRepository);
}
