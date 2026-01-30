import type { IService } from "@application/interfaces/service";
import type {
	GetAllProjectsByUserInput,
	GetAllProjectsByUserOutput,
} from "./dto";

export interface IGetAllProjectsByUserService
	extends IService<GetAllProjectsByUserInput, GetAllProjectsByUserOutput> {}

export class GetAllProjectsByUserService
	implements IGetAllProjectsByUserService
{
	async execute(
		data: GetAllProjectsByUserInput,
	): Promise<GetAllProjectsByUserOutput> {
		return {
			success: true,
		};
	}
}
