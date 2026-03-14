import type { IService } from "@application/interfaces/service";
import { IAuthProvider } from "@data/protocols/auth/auth-provider";
import { SignupInput, SignupOutput } from "./dto";


export interface ISignupService
	extends IService<SignupInput, SignupOutput> {}

export class SignupService
	implements ISignupService
{
	constructor(private readonly authProvider: IAuthProvider) {}

	async execute(
		data: SignupInput,
	): Promise<SignupOutput> {
		const result = await this.authProvider.signUp({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		});
		
		return {
			userId: result.userId,
		};
	}
}
