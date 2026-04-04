import type { MemberDto } from "../../sharing/entities";
import type { SharingRole } from "../../sharing/types";

/**
 * Project as returned/sent by the API (serialized format).
 * Dates are ISO strings over the wire.
 */
export interface Project {
	id: string;
	userId: string;
	name: string;
	description?: string | null;
	color: string;
	deletedAt?: string | null;
	createdAt: string;
	updatedAt: string;
	/** "owner" for own projects, "editor"/"viewer" for shared */
	role?: SharingRole;
	/** true when project belongs to another user */
	isShared?: boolean;
	/** total members (owner + guests) */
	memberCount?: number;
	/** embedded members list (API-internal; not sent to SPA by default) */
	members?: MemberDto[];
}

export interface Summary {
	completedCount: number;
	totalCount: number;
	percentageCompleted: number;
}

export type ProjectSummary = Project & Summary;
