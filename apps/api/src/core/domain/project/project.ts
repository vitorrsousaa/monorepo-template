export interface Project {
	id: string;
	userId: string;
	name: string;
	description?: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
