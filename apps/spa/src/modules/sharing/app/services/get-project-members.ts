import { httpClient } from "@/services/http-client";
import type { GetProjectMembersResponse } from "@repo/contracts/sharing/get-project-members";

export interface GetProjectMembersInput {
	projectId: string;
}

export async function getProjectMembers(
	input: GetProjectMembersInput,
): Promise<GetProjectMembersResponse> {
	const { data } = await httpClient.get<GetProjectMembersResponse>(
		`/projects/${input.projectId}/sharing/members`,
	);
	return data;
}
