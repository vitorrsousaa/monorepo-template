/**
 * Project as returned/sent by the API (serialized format).
 * Dates are ISO strings over the wire.
 */
export interface ProjectDto {
	id: string;
	userId: string;
	name: string;
	description?: string;
	deletedAt?: string;
	createdAt: string;
	updatedAt: string;
}

/** Response body of GET /projects - list of projects for the current user. */
export interface GetAllProjectsByUserResponse {
	projects: ProjectDto[];
}
