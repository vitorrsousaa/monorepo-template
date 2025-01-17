import { ProfileController } from "@application/modules/auth/controllers/profile";
import { makeAuthenticationMiddleware } from "@factories/middlewares/authentication";
import { makeProfileService } from "@factories/services/auth/profile";

export function makeProfileController() {
	return new ProfileController(
		makeProfileService(),
		makeAuthenticationMiddleware(),
	);
}
