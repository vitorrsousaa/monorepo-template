export interface Todo {
	id: string;
	userId: string;
	/** When null/undefined, task is in Inbox (no project). */
	projectId?: string | null;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	/** Used for ordering inside a section/project or inbox. */
	order?: number;
	completedAt?: Date | null;
}
