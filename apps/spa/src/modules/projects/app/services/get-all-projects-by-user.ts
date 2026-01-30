import { httpClient } from "@/services/http-client";
import type { Project } from "../entitites/project";

export async function getAllProjectsByUser() {
	const { data } = await httpClient.get<{ projects: Project[] }>("/projects");

	return data?.projects;
}
