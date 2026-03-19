import { httpClient } from "@/services/http-client";
import type { GetAllSectionsResponse } from "@repo/contracts/sections/get-all";

export interface GetAllSectionsByProjectInput {
	projectId: string;
}

export async function getAllSectionsByProject(
	input: GetAllSectionsByProjectInput,
) {
	const { data } = await httpClient.get<GetAllSectionsResponse>(
		`/projects/${input.projectId}/sections`,
	);

	return data;
}
