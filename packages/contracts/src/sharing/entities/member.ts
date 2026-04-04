import type { SharingRole } from "../types/types";

export interface MemberDto {
	userId: string;
	name: string;
	email: string;
	role: SharingRole;
	joinedAt: string | null;
}
