export interface Recurrence {
	enabled: boolean;
	frequency: "daily" | "weekly" | "monthly" | "yearly";
	weeklyDays?: number[]; // 0=Sun..6=Sat, only when frequency=weekly
	endType: "never" | "on_date" | "after_count";
	endDate?: string; // ISO date, only when endType=on_date
	endCount?: number; // remaining occurrences, only when endType=after_count
}

/**
 * Task as returned/sent by the API (serialized format).
 * Source of truth for task/todo wire format.
 * Dates are ISO strings over the wire.
 */
export interface Task {
	id: string;
	userId: string;
	projectId: string | null;
	sectionId: string | null;
	title: string;
	description: string | null;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
	order?: number;
	completedAt: string | null;
	dueDate: string | null;
	priority: "low" | "medium" | "high" | null;
	recurrence: Recurrence | null;
	nextTaskId: string | null;
}

export type TaskDto = Task;
