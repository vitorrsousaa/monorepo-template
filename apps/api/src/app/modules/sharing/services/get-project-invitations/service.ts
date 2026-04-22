import type { IService } from "@application/interfaces/service";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import type {
	GetProjectInvitationsInputService,
	GetProjectInvitationsOutputService,
} from "./dto";

export interface IGetProjectInvitationsService
	extends IService<
		GetProjectInvitationsInputService,
		GetProjectInvitationsOutputService
	> {}

export class GetProjectInvitationsService
	implements IGetProjectInvitationsService
{
	constructor(
		private readonly permissionService: IPermissionService,
		private readonly sharingRepo: ISharingRepository,
	) {}

	async execute(
		input: GetProjectInvitationsInputService,
	): Promise<GetProjectInvitationsOutputService> {
		const { userId, projectId } = input;

		// Owner only
		await this.permissionService.requireRole({
			requesterId: userId,
			resourceType: "project",
			resourceId: projectId,
			requiredRole: "owner",
		});

		const invitations =
			await this.sharingRepo.getAllInvitationsByProject(projectId);

		return {
			invitations: invitations.map(({ updatedAt: _, ...inv }) => ({
				...inv,
				role: inv.role,
			})),
		};
	}
}
