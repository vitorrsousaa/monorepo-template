import { SignupService } from "@application/modules/auth/services/signup";
import { makeCognitoAuthProvider } from "@infra/auth/cognito/factories/cognito-auth-provider";
import { makeUserDynamoRepository } from "@infra/db/dynamodb/factories/user-repository-factory";

export function makeSignupService(): SignupService {
	const authProvider = makeCognitoAuthProvider();
	const userRepository = makeUserDynamoRepository();
	return new SignupService(authProvider, userRepository);
}
