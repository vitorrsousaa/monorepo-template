import { httpClient } from "@/services/http-client";
import type { RemoveMemberResponse } from "@repo/contracts/sharing/remove-member";

export interface RemoveMemberInput {
	projectId: string;
	memberUserId: string;
}

export async function removeMember(
	input: RemoveMemberInput,
): Promise<RemoveMemberResponse> {
	const { data } = await httpClient.delete<RemoveMemberResponse>(
		`/projects/${input.projectId}/sharing/members/${input.memberUserId}`,
	);
	return data;
}
