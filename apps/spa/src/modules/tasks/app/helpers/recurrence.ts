import type { Task } from "@repo/contracts/tasks/entities";

export function nextRecurrenceForOptimistic(
	recurrence: Task["recurrence"],
): Task["recurrence"] {
	if (!recurrence) return null;
	const next = { ...recurrence };
	if (next.endType === "after_count" && next.endCount !== undefined) {
		next.endCount = next.endCount - 1;
	}
	return next;
}
