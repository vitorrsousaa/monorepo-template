import { ProfileController } from "@application/modules/auth/controllers/profile";
import { makeProfileService } from "@factories/services/auth/profile";

export function makeProfileController(): ProfileController {
	return new ProfileController(makeProfileService());
}
