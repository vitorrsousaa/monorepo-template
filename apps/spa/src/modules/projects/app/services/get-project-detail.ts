import { httpClient } from "@/services/http-client";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";

export interface GetProjectDetailInput {
	projectId: string;
}

export async function getProjectDetail(input: GetProjectDetailInput) {
	const { data } = await httpClient.get<{ data: GetProjectDetailResponse }>(
		`/projects/${input.projectId}/detail`,
	);

	return data.data;
}
