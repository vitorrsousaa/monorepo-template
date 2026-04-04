import type { IService } from "@application/interfaces/service";
import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import type { Member } from "@core/domain/sharing/member";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import { MemberNotFoundError } from "../../errors/member-not-found";
import type {
	UpdateMemberRoleInputService,
	UpdateMemberRoleOutputService,
} from "./dto";

export interface IUpdateMemberRoleService
	extends IService<
		UpdateMemberRoleInputService,
		UpdateMemberRoleOutputService
	> {}

export class UpdateMemberRoleService implements IUpdateMemberRoleService {
	constructor(
		private readonly permissionService: IPermissionService,
		private readonly sharingRepo: ISharingRepository,
		private readonly projectRepo: IProjectRepository,
	) {}

	async execute(
		input: UpdateMemberRoleInputService,
	): Promise<UpdateMemberRoleOutputService> {
		const { userId, projectId, memberId, role } = input;

		// Owner only
		const { ownerUserId } = await this.permissionService.requireRole({
			requesterId: userId,
			resourceType: "project",
			resourceId: projectId,
			requiredRole: "owner",
		});

		const boardAccess = await this.sharingRepo.getBoardAccess({
			guestUserId: memberId,
			resourceType: "project",
			resourceId: projectId,
		});
		if (!boardAccess) throw new MemberNotFoundError();

		const project = await this.projectRepo.getById(projectId, ownerUserId);
		if (!project) throw new ProjectNotFound();

		const currentMembers: Member[] = project.members ?? [];
		const updatedMembers = currentMembers.map((m) =>
			m.userId === memberId ? { ...m, role } : m,
		);

		await this.sharingRepo.updateMemberRole({
			boardAccess,
			newRole: role,
			project,
			updatedMembers,
		});
	}
}
