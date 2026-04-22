import { httpClient } from "@/services/http-client";
import type { UpdateMemberRoleInput } from "@repo/contracts/sharing/update-member-role";
import type { UpdateMemberRoleResponse } from "@repo/contracts/sharing/update-member-role";

export interface UpdateMemberRoleParams {
	projectId: string;
	memberUserId: string;
	body: UpdateMemberRoleInput;
}

export async function updateMemberRole(
	params: UpdateMemberRoleParams,
): Promise<UpdateMemberRoleResponse> {
	const { data } = await httpClient.patch<UpdateMemberRoleResponse>(
		`/projects/${params.projectId}/sharing/members/${params.memberUserId}`,
		params.body,
	);
	return data;
}
