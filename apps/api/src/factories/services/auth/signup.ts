import { SignupService } from "@application/modules/auth/services/signup";

export function makeSignupService(): SignupService {
	return new SignupService();
}
