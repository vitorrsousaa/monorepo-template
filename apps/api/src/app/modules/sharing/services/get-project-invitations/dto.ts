import type { InvitationDto } from "@repo/contracts/sharing/entities";

export interface GetProjectInvitationsInputService {
	userId: string;
	projectId: string;
}

export interface GetProjectInvitationsOutputService {
	invitations: InvitationDto[];
}
