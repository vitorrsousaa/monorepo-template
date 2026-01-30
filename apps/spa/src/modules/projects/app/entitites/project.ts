export interface Project {
	id: string;
	name: string;
	description?: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
