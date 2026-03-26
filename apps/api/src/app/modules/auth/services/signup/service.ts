import type { IService } from "@application/interfaces/service";
import type { IAuthProvider } from "@data/protocols/auth/auth-provider";
import type { IUserRepository } from "@data/protocols/auth/user-repository";
import type { SignupInput, SignupOutput } from "./dto";
import { IUserSettingsRepository } from "@data/protocols/settings/settings-repository";

export interface ISignupService extends IService<SignupInput, SignupOutput> {}

export class SignupService implements ISignupService {
	constructor(
		private readonly authProvider: IAuthProvider,
		private readonly userRepository: IUserRepository,
		private readonly userSettingsRepository: IUserSettingsRepository,
	) {}

	async execute(data: SignupInput): Promise<SignupOutput> {
		const result = await this.authProvider.signUp({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		});

		await this.userRepository.create({
			id: result.userId,
			email: data.email,
			name: `${data.firstName} ${data.lastName}`,
		});
		
		await this.userSettingsRepository.create({
			userId: result.userId,
			settings: {
				preferences: {
					language: "en",
				},
			},
		})

		return {
			userId: result.userId,
		};
	}
}
