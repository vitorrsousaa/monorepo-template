import type { TaskDto } from "@repo/contracts/tasks/entities";

/**
 * Returns the Tailwind stripe color class for a given priority.
 * Returns null when priority is null (no stripe should be rendered).
 */
export function getPriorityStripeColor(
	priority: TaskDto["priority"],
): string | null {
	if (priority === "high") return "bg-red-500";
	if (priority === "medium") return "bg-amber-500";
	if (priority === "low") return "bg-primary/70";
	return null;
}
