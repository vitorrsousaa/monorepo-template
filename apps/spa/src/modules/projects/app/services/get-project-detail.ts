import type { ProjectDetail } from "@/modules/projects/app/entitites/project-detail";
import { httpClient } from "@/services/http-client";

export interface GetProjectDetailInput {
	projectId: string;
}

export async function getProjectDetail(input: GetProjectDetailInput) {
	const { data } = await httpClient.get<{ data: ProjectDetail }>(
		`/projects/${input.projectId}/detail`,
	);

	return data.data;
}
