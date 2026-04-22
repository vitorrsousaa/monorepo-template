import type { IService } from "@application/interfaces/service";
import { InvitationNotFoundError } from "@application/modules/sharing/errors";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import type {
	CancelInvitationInputService,
	CancelInvitationOutputService,
} from "./dto";

export interface ICancelInvitationService
	extends IService<
		CancelInvitationInputService,
		CancelInvitationOutputService
	> {}

export class CancelInvitationService implements ICancelInvitationService {
	constructor(
		private readonly permissionService: IPermissionService,
		private readonly sharingRepo: ISharingRepository,
	) {}

	async execute(
		input: CancelInvitationInputService,
	): Promise<CancelInvitationOutputService> {
		const { userId, projectId, invitationId } = input;

		// Owner only
		await this.permissionService.requireRole({
			requesterId: userId,
			resourceType: "project",
			resourceId: projectId,
			requiredRole: "owner",
		});

		const invitations =
			await this.sharingRepo.getAllInvitationsByProject(projectId);
		const invitation = invitations.find((inv) => inv.id === invitationId);
		if (!invitation) throw new InvitationNotFoundError();

		await this.sharingRepo.cancelInvitation(invitation);
	}
}
