import type { IService } from "@application/interfaces/service";
import { UserNotFound } from "@application/modules/auth/errors/user-not-found";
import type { IUserRepository } from "@data/protocols/auth/user-repository";
import type { ProfileInput, ProfileOutput } from "./dto";

export interface IProfileService
	extends IService<ProfileInput, ProfileOutput> {}

export class ProfileService implements IProfileService {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(data: ProfileInput): Promise<ProfileOutput> {
		const user = await this.userRepository.getById(data.userId);

		if (!user) {
			throw new UserNotFound();
		}

		return {
			user,
		};
	}
}
