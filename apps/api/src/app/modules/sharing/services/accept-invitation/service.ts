import { randomUUID } from "node:crypto";
import type { IService } from "@application/interfaces/service";
import {
	InvitationExpiredError,
	InvitationNotFoundError,
	InvitationNotPendingError,
	MemberLimitExceededError,
	UserNotFoundError,
} from "@application/modules/sharing/errors";
import type { IUserRepository } from "@data/protocols/auth/user-repository";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import type {
	AcceptInvitationInputService,
	AcceptInvitationOutputService,
} from "./dto";

const MAX_MEMBERS = 20;

export interface IAcceptInvitationService
	extends IService<
		AcceptInvitationInputService,
		AcceptInvitationOutputService
	> {}

export class AcceptInvitationService implements IAcceptInvitationService {
	constructor(
		private readonly sharingRepo: ISharingRepository,
		private readonly userRepo: IUserRepository,
		private readonly projectRepo: IProjectRepository,
	) {}

	async execute(
		input: AcceptInvitationInputService,
	): Promise<AcceptInvitationOutputService> {
		const { userId, invitationId } = input;

		// 1. Get user (need email for lookup)
		const user = await this.userRepo.getById(userId);
		if (!user) throw new UserNotFoundError();

		// 2. Find invitation by id + email
		const invitation = await this.sharingRepo.getInvitationByIdAndEmail({
			invitationId,
			guestEmail: user.email,
		});
		if (!invitation) throw new InvitationNotFoundError();

		// 3. Validate status
		if (invitation.status !== "pending") throw new InvitationNotPendingError();

		// 4. Validate expiry
		if (new Date(invitation.expiresAt) < new Date())
			throw new InvitationExpiredError();

		// 5. Get project (using ownerUserId as userId for project repo)
		const project = await this.projectRepo.getById(
			invitation.resourceId,
			invitation.ownerUserId,
		);
		if (!project) throw new InvitationNotFoundError();

		// 6. Validate member count
		const currentMembers = project.members ?? [];
		if (currentMembers.length >= MAX_MEMBERS)
			throw new MemberLimitExceededError();

		// 7. Build new member + board access
		const now = new Date().toISOString();
		const newMember = {
			userId,
			name: user.name,
			email: user.email,
			role: invitation.role,
			joinedAt: now,
		};
		const boardAccess = {
			id: randomUUID(),
			resourceType: invitation.resourceType,
			resourceId: invitation.resourceId,
			ownerUserId: invitation.ownerUserId,
			guestUserId: userId,
			role: invitation.role,
			invitedAt: invitation.createdAt,
			acceptedAt: now,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		};

		await this.sharingRepo.acceptInvitation({
			invitation,
			boardAccess,
			newMember,
			project,
			currentMembers,
		});
	}
}
