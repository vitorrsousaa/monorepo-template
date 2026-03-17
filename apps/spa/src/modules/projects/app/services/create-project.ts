import { httpClient } from "@/services/http-client";
import type { CreateProjectInput } from "@repo/contracts/projects/create";
import type { Project } from "@repo/contracts/projects/entities";

export async function createProject(
	input: Omit<CreateProjectInput, "userId">,
) {
	const { data } = await httpClient.post<{ project: Project }>(
		"/projects",
		input,
	);
	
	return data

}
