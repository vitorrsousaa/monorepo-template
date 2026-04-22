import { httpClient } from "@/services/http-client";
import type { InviteToProjectInput } from "@repo/contracts/sharing/invite-to-project";
import type { InviteToProjectResponse } from "@repo/contracts/sharing/invite-to-project";

export interface InviteToProjectParams {
	projectId: string;
	body: InviteToProjectInput;
}

export async function inviteToProject(
	params: InviteToProjectParams,
): Promise<InviteToProjectResponse> {
	const { data } = await httpClient.post<InviteToProjectResponse>(
		`/projects/${params.projectId}/sharing/invite`,
		params.body,
	);
	return data;
}
