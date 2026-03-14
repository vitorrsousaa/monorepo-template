import type { IService } from "@application/interfaces/service";
import { IAuthProvider } from "@data/protocols/auth/auth-provider";
import type { SigninInput, SigninOutput } from "./dto";

export interface ISigninService
	extends IService<SigninInput, SigninOutput> {}

export class SigninService implements ISigninService {
	constructor(private readonly authProvider: IAuthProvider) {}

	async execute(data: SigninInput): Promise<SigninOutput> {
		const result = await this.authProvider.signIn({
			email: data.email,
			password: data.password,
		});
		return {
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
			idToken: result.idToken,
		};
	}
}
