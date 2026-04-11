import type { IService } from "@application/interfaces/service";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type {
	CreateSectionServiceInput,
	CreateSectionServiceOutput,
} from "./dto";

export interface ICreateSectionService
	extends IService<CreateSectionServiceInput, CreateSectionServiceOutput> {}

export class CreateSectionService implements ICreateSectionService {
	constructor(
		private readonly sectionRepository: ISectionRepository,
		private readonly permissionService?: IPermissionService,
	) {}

	async execute(
		data: CreateSectionServiceInput,
	): Promise<CreateSectionServiceOutput> {
		let ownerUserId = data.userId;
		if (this.permissionService) {
			const result = await this.permissionService.requireRole({
				requesterId: data.userId,
				resourceType: "project",
				resourceId: data.projectId,
				requiredRole: "editor",
			});
			ownerUserId = result.ownerUserId;
		}

		let order = data.order;

		if (order === undefined) {
			const sections = await this.sectionRepository.getAllByProject(
				data.projectId,
				ownerUserId,
			);
			order =
				sections.length === 0
					? 1
					: Math.max(...sections.map((s) => s.order)) + 1;
		}

		const section = await this.sectionRepository.create({
			userId: ownerUserId,
			projectId: data.projectId,
			name: data.name,
			order,
		});

		return { section };
	}
}
