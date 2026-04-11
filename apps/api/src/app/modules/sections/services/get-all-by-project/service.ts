import type { IService } from "@application/interfaces/service";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type { GetAllByProjectInput, GetAllByProjectOutput } from "./dto";

export interface IGetAllByProjectService
	extends IService<GetAllByProjectInput, GetAllByProjectOutput> {}

export class GetAllByProjectService implements IGetAllByProjectService {
	constructor(
		private readonly sectionRepository: ISectionRepository,
		private readonly permissionService?: IPermissionService,
	) {}

	async execute(data: GetAllByProjectInput): Promise<GetAllByProjectOutput> {
		let ownerUserId = data.userId;
		if (this.permissionService) {
			const result = await this.permissionService.requireRole({
				requesterId: data.userId,
				resourceType: "project",
				resourceId: data.projectId,
				requiredRole: "viewer",
			});
			ownerUserId = result.ownerUserId;
		}

		const sections = await this.sectionRepository.getAllByProject(
			data.projectId,
			ownerUserId,
		);

		return {
			sections,
			total: sections.length,
		};
	}
}
