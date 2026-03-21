import { httpClient } from "@/services/http-client";
import type { Project } from "@repo/contracts/projects/entities";

export async function getAllProjectsByUser() {
	const { data } = await httpClient.get<{ projects: Project[] }>("/projects");

	return data?.projects;
}
