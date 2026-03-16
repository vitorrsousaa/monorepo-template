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
