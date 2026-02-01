export type Section = {
	id: string;
	userId: string;
	projectId: string;
	name: string;
	description?: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	order: number;
};
