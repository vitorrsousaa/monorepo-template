import { ProfileService } from "@application/modules/auth/services/profile";
import { makeUserRepository } from "@factories/repositories/user";

export function makeProfileService() {
	return new ProfileService(makeUserRepository());
}
