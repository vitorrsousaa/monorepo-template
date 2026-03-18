import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type {
	GetAllProjectsByUserInputService,
	GetAllProjectsByUserOutputService,
} from "./dto";

export interface IGetAllProjectsByUserService
	extends IService<GetAllProjectsByUserInputService, GetAllProjectsByUserOutputService> {}

export class GetAllProjectsByUserService
	implements IGetAllProjectsByUserService
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(
		data: GetAllProjectsByUserInputService,
	): Promise<GetAllProjectsByUserOutputService> {
		const projects = await this.projectRepository.getAllProjectsByUser(
			data.userId,
		);

		return {
			projects,
		};
	}
}
