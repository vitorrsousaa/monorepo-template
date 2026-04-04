import type { ResourceType, SharingRole } from "../types/types";

export interface BoardAccessDto {
	id: string;
	resourceType: ResourceType;
	resourceId: string;
	ownerUserId: string;
	guestUserId: string;
	role: Exclude<SharingRole, "owner">;
	acceptedAt: string;
	createdAt: string;
}
