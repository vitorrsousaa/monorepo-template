import type { IService } from "@application/interfaces/service";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { CreateSectionInput, CreateSectionOutput } from "./dto";

export interface ICreateSectionService
	extends IService<CreateSectionInput, CreateSectionOutput> {}

export class CreateSectionService implements ICreateSectionService {
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(data: CreateSectionInput): Promise<CreateSectionOutput> {
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

		return {
			section: {
				id: section.id,
				name: section.name,
				order: section.order,
				createdAt: section.createdAt,
				updatedAt: section.updatedAt,
			},
		};
	}
}
