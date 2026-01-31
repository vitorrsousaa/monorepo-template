import type { CreateProjectInput } from "@/modules/projects/app/entitites/create-project";
import type { Project } from "@/modules/projects/app/entitites/project";
import { httpClient } from "@/services/http-client";

export async function createProject(input: CreateProjectInput) {
	const { data } = await httpClient.post<{ project: Project }>(
		"/projects",
		input,
	);

	return data;
}
