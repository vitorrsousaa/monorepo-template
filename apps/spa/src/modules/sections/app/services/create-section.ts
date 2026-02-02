import type { CreateSectionInput } from "@/modules/sections/app/entities/create-section";
import { httpClient } from "@/services/http-client";
import type { Section } from "../entities/section";

export async function createSection(input: CreateSectionInput) {
	const { data } = await httpClient.post<{ section: Section }>(
		`/projects/${input.projectId}/sections`,
		input,
	);

	return data;
}
