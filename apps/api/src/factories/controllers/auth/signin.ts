import { SigninController } from "@application/modules/auth/controllers/signin";
import { makeSigninService } from "@factories/services/auth/signin";

export function makeSigninController(): SigninController {
	const signinService = makeSigninService();
	return new SigninController(signinService);
}
