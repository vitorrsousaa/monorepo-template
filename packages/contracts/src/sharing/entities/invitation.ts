import type {
	InvitationStatus,
	ResourceType,
	SharingRole,
} from "../types/types";

export interface InvitationDto {
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

export type Invitation = InvitationDto;
