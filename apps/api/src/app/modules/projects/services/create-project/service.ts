import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { CreateProjectInputService, CreateProjectOutputService } from "./dto";

export interface ICreateProjectService
	extends IService<CreateProjectInputService, CreateProjectOutputService> {}

export class CreateProjectService implements ICreateProjectService {
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(data: CreateProjectInputService): Promise<CreateProjectOutputService> {
		const project = await this.projectRepository.create(data);

		return {
			project
		};
	}
}
