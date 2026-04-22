import type { ResourceType, SharingRole } from "@repo/contracts/sharing/types";

export interface BoardAccess {
	id: string;
	resourceType: ResourceType;
	resourceId: string;
	ownerUserId: string;
	guestUserId: string;
	role: SharingRole;
	invitedAt: string;
	acceptedAt: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}
