import { SignupService } from "@application/modules/auth/services/signup";
import { makeCognitoAuthProvider } from "@infra/auth/cognito/factories/cognito-auth-provider";

export function makeSignupService(): SignupService {
	const authProvider = makeCognitoAuthProvider();
	return new SignupService(authProvider);
}
