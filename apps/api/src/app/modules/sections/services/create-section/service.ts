import type { IService } from "@application/interfaces/service";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { CreateSectionServiceInput, CreateSectionServiceOutput } from "./dto";

export interface ICreateSectionService
	extends IService<CreateSectionServiceInput, CreateSectionServiceOutput> {}

export class CreateSectionService implements ICreateSectionService {
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(data: CreateSectionServiceInput): Promise<CreateSectionServiceOutput> {
		let order = data.order;

		if (order === undefined) {
			const sections = await this.sectionRepository.getAllByProject(
				data.projectId,
				data.userId,
			);
			order =
				sections.length === 0
					? 1
					: Math.max(...sections.map((s) => s.order)) + 1;
		}

		const section = await this.sectionRepository.create({
			userId: data.userId,
			projectId: data.projectId,
			name: data.name,
			order,
		});

		return { section };
	}
}
