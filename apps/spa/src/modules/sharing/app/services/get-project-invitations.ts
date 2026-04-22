import { httpClient } from "@/services/http-client";
import type { GetProjectInvitationsResponse } from "@repo/contracts/sharing/get-project-invitations";

export interface GetProjectInvitationsInput {
	projectId: string;
}

export async function getProjectInvitations(
	input: GetProjectInvitationsInput,
): Promise<GetProjectInvitationsResponse> {
	const { data } = await httpClient.get<GetProjectInvitationsResponse>(
		`/projects/${input.projectId}/sharing/invitations`,
	);
	return data;
}
