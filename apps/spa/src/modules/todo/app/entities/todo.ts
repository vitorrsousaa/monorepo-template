export const PRIORITY_VALUES = ["none", "low", "medium", "high"] as const;
export type PriorityValue = (typeof PRIORITY_VALUES)[number];

export type Todo = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	priority?: "low" | "medium" | "high";
	project?: string | null;
	dueDate?: string | Date | null;
};
