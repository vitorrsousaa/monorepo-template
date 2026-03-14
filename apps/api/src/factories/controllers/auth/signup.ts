import { SignupController } from "@application/modules/auth/controllers/signup";
import { makeSignupService } from "@factories/services/auth/signup";

export function makeSignupController(): SignupController {
	const signupService = makeSignupService();

	return new SignupController(signupService);
}
