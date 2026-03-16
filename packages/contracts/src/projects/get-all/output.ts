import type { ProjectDto } from "../entities";

/** Response body of GET /projects - list of projects for the current user. */
export interface GetAllProjectsByUserResponse {
	projects: ProjectDto[];
}
