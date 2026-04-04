import type {
	InvitationStatus,
	ResourceType,
	SharingRole,
} from "../types/types";

export interface InvitationDto {
	id: string;
	resourceType: ResourceType;
	resourceId: string;
	projectName: string;
	ownerName: string;
	invitedEmail: string;
	invitedUserId: string | null;
	role: Exclude<SharingRole, "owner">;
	status: InvitationStatus;
	expiresAt: string;
	createdAt: string;
}
