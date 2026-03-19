import type { CreateSectionInput } from "@repo/contracts/sections/create";
import type { CreateSectionOutput } from "@repo/contracts/sections/create";
import { httpClient } from "@/services/http-client";

export interface CreateSectionServiceInput extends CreateSectionInput {
	projectId: string; // URL path param, not sent in body
}

export async function createSection(input: CreateSectionServiceInput) {
	const { projectId, ...body } = input;
	const { data } = await httpClient.post<CreateSectionOutput>(
		`/projects/${projectId}/sections`,
		body,
	);

	return data;
}
