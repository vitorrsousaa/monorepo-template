export interface Section {
	id: string;
	userId: string;
	projectId: string;
	name: string;
	order: number;
	deletedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}
