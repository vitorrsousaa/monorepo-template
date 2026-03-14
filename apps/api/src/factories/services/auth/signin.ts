import { SigninService } from "@application/modules/auth/services/signin";
import { makeCognitoAuthProvider } from "@infra/auth/cognito/factories/cognito-auth-provider";

export function makeSigninService(): SigninService {
	const authProvider = makeCognitoAuthProvider();
	return new SigninService(authProvider);
}
