export interface Todo {
	id: string;
	userId: string;
	projectId?: string | null;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	order?: number;
	completedAt?: Date | null;
	dueDate?: Date | null;
	priority?: "low" | "medium" | "high" | null;
}
