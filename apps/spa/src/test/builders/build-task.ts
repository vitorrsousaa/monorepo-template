import type { Task } from "@repo/contracts/tasks/entities";

export function buildTask(overrides?: Partial<Task>): Task {
	return {
		id: "task-1",
		userId: "user-1",
		projectId: "project-1",
		sectionId: "section-1",
		title: "Default Task",
		description: null,
		completed: false,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		completedAt: null,
		dueDate: null,
		priority: null,
		order: 0,
		recurrence: null,
		nextTaskId: null,
		...overrides,
	};
}
