import { AppError } from "@application/errors/app-error";
import type { IService } from "@application/interfaces/service";
import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import type { Member } from "@core/domain/sharing/member";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import type {
	RemoveMemberInputService,
	RemoveMemberOutputService,
} from "./dto";

export interface IRemoveMemberService
	extends IService<RemoveMemberInputService, RemoveMemberOutputService> {}

export class RemoveMemberService implements IRemoveMemberService {
	constructor(
		private readonly permissionService: IPermissionService,
		private readonly sharingRepo: ISharingRepository,
		private readonly projectRepo: IProjectRepository,
	) {}

	async execute(
		input: RemoveMemberInputService,
	): Promise<RemoveMemberOutputService> {
		const { userId, projectId, memberId } = input;

		const isSelfRemove = userId === memberId;

		// Owner removing another member: require owner role (returns ownerUserId=userId)
		// Self-remove: require viewer role to confirm membership and get ownerUserId
		const requiredRole = isSelfRemove
			? ("viewer" as const)
			: ("owner" as const);
		const { ownerUserId } = await this.permissionService.requireRole({
			requesterId: userId,
			resourceType: "project",
			resourceId: projectId,
			requiredRole,
		});

		const boardAccess = await this.sharingRepo.getBoardAccess({
			guestUserId: memberId,
			resourceType: "project",
			resourceId: projectId,
		});
		if (!boardAccess) throw new AppError("Member not found", 404);

		const project = await this.projectRepo.getById(projectId, ownerUserId);
		if (!project) throw new ProjectNotFound();

		const currentMembers: Member[] = project.members ?? [];
		const updatedMembers = currentMembers.filter((m) => m.userId !== memberId);

		await this.sharingRepo.removeMember({
			boardAccess,
			project,
			updatedMembers,
		});
	}
}
