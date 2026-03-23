import type { IService } from "@application/interfaces/service";
import { UserNotFound } from "@application/modules/auth/errors/user-not-found";
import type { IUserRepository } from "@data/protocols/auth/user-repository";
import type { GetAccountInfoInput, GetAccountInfoOutput } from "./dto";

export interface IGetAccountInfoService
	extends IService<GetAccountInfoInput, GetAccountInfoOutput> {}

export class GetAccountInfoService implements IGetAccountInfoService {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(data: GetAccountInfoInput): Promise<GetAccountInfoOutput> {
		const user = await this.userRepository.getById(data.userId);

		if (!user) {
			throw new UserNotFound();
		}

		return {
			user,
		};
	}
}
