import type { IService } from "@application/interfaces/service";
import { SignupInput, SignupOutput } from "./dto";


export interface ISignupService
	extends IService<SignupInput, SignupOutput> {}

export class SignupService
	implements ISignupService
{
	constructor() {}

	async execute(
		data: SignupInput,
	): Promise<SignupOutput> {
		return {
			userId: "123",
		};
	}
}
