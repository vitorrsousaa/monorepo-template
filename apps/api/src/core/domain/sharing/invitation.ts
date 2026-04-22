import type {
	InvitationStatus,
	ResourceType,
	SharingRole,
} from "@repo/contracts/sharing/types";

export interface Invitation {
	id: string;
	resourceType: ResourceType;
	resourceId: string;
	ownerUserId: string;
	invitedEmail: string;
	invitedUserId: string | null;
	role: SharingRole;
	status: InvitationStatus;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
}
