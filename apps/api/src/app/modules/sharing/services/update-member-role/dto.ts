import type { SharingRole } from "@repo/contracts/sharing/types";

export interface UpdateMemberRoleInputService {
	userId: string;
	projectId: string;
	memberId: string;
	role: Exclude<SharingRole, "owner">;
}

export type UpdateMemberRoleOutputService = undefined;
