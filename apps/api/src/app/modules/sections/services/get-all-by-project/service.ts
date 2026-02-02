import type { IService } from "@application/interfaces/service";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { GetAllByProjectInput, GetAllByProjectOutput } from "./dto";

export interface IGetAllByProjectService
	extends IService<GetAllByProjectInput, GetAllByProjectOutput> {}

export class GetAllByProjectService implements IGetAllByProjectService {
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(data: GetAllByProjectInput): Promise<GetAllByProjectOutput> {
		const sections = await this.sectionRepository.getAllByProject(
			data.projectId,
			data.userId,
		);

		return {
			sections,
			total: sections.length,
		};
	}
}
