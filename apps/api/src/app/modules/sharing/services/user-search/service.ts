import type { IService } from "@application/interfaces/service";
import type { IUserRepository } from "@data/protocols/auth/user-repository";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import type { UserSearchInputService, UserSearchOutputService } from "./dto";

export interface IUserSearchService
	extends IService<UserSearchInputService, UserSearchOutputService> {}

export class UserSearchService implements IUserSearchService {
	constructor(
		private readonly sharingRepo: ISharingRepository,
		private readonly userRepo: IUserRepository,
	) {}

	async execute(
		input: UserSearchInputService,
	): Promise<UserSearchOutputService> {
		const { email } = input;

		const userId = await this.sharingRepo.getUserIdByEmail(email);
		if (!userId) return { user: null };

		const user = await this.userRepo.getById(userId);
		if (!user) return { user: null };

		return { user: { userId: user.id, name: user.name, email: user.email } };
	}
}
