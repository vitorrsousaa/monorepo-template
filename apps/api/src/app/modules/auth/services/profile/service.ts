import type { IUserRepository } from "@application/database/repositories/user";
import type { IService } from "@application/interfaces/service";
import type { User } from "@core/domain/user";
import * as z from "zod";

export const ProfileInputServiceSchema = z.object({
	userId: z.string().uuid(),
});

export type TProfile = z.infer<typeof ProfileInputServiceSchema>;

export type IProfileInput = TProfile;

export type IProfileOutput = User;

export type IProfileService = IService<IProfileInput, IProfileOutput>;

export class ProfileService implements IProfileService {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(profileInput: IProfileInput): Promise<IProfileOutput> {
		const user = await this.userRepository.getById(profileInput.userId);

		if (!user) {
			throw new Error("User not found");
		}

		return user;
	}
}
