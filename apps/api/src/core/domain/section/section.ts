export interface Section {
	id: string;
	userId: string;
	projectId: string;
	name: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	order: number;
}
