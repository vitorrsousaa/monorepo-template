import { httpClient } from "@/services/http-client";
import type { Section } from "../entities/section";

export interface GetAllSectionsByProjectInput {
	projectId: string;
}

export interface GetAllSectionsByProjectOutput {
	sections: Section[];
	total: number;
}

export async function getAllSectionsByProject(
	input: GetAllSectionsByProjectInput,
) {
	const { data } = await httpClient.get<GetAllSectionsByProjectOutput>(
		`/projects/${input.projectId}/sections`,
	);

	return data;
}
