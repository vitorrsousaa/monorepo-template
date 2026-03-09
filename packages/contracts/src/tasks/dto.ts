/**
 * Task as returned/sent by the API (serialized format).
 * Source of truth for task/todo wire format.
 * Dates are ISO strings over the wire.
 */
export interface TaskDto {
	id: string;
	userId: string;
	projectId: string | null;
	sectionId: string | null;
	title: string;
	description: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
	order?: number;
	completedAt: string | null;
	dueDate: string | null;
	priority: "low" | "medium" | "high" | null;
}
