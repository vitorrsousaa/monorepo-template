/**
 * Project as returned/sent by the API (serialized format).
 * Dates are ISO strings over the wire.
 */
export interface Project {
	id: string;
	userId: string;
	name: string;
	description?: string | null;
	color: string;
	deletedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

