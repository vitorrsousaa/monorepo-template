import type { SharingRole } from "@repo/contracts/sharing/types";

export interface Member {
	userId: string;
	name: string;
	email: string;
	role: SharingRole;
	joinedAt: string | null;
}
