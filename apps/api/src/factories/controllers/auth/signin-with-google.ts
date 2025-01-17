import { SigninWithGoogleController } from "@application/modules/auth/controllers/signin-with-google";
import { makeSigninWithGoogleService } from "@factories/services/auth/signin-with-google";

export function makeSigninWithGoogleController() {
	return new SigninWithGoogleController(makeSigninWithGoogleService());
}
