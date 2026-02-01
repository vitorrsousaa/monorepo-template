import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { CreateProjectInput, CreateProjectOutput } from "./dto";

export interface ICreateProjectService
	extends IService<CreateProjectInput, CreateProjectOutput> {}

export class CreateProjectService implements ICreateProjectService {
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(data: CreateProjectInput): Promise<CreateProjectOutput> {
		const project = await this.projectRepository.create(data);

		return {
			project: {
				id: project.id,
				name: project.name,
				description: project.description,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt,
			},
		};
	}
}
