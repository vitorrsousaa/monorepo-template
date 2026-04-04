export const SharingRole = {
	OWNER: "owner",
	EDITOR: "editor",
	VIEWER: "viewer",
} as const;
export type SharingRole = (typeof SharingRole)[keyof typeof SharingRole];

export const InvitationStatus = {
	PENDING: "pending",
	ACCEPTED: "accepted",
	DECLINED: "declined",
	CANCELLED: "cancelled",
	EXPIRED: "expired",
} as const;
export type InvitationStatus =
	(typeof InvitationStatus)[keyof typeof InvitationStatus];

export const ResourceType = {
	PROJECT: "project",
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const SHARING_ROLE_HIERARCHY: Record<SharingRole, number> = {
	viewer: 0,
	editor: 1,
	owner: 2,
};
