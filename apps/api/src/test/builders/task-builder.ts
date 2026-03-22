import type { Task } from "@repo/contracts/tasks";

const defaults: Task = {
	id: "task-001",
	userId: "user-001",
	projectId: null,
	sectionId: null,
	title: "Test task",
	description: null,
	completed: false,
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
	order: 0,
	completedAt: null,
	dueDate: null,
	priority: null,
};

export function buildTask(overrides?: Partial<Task>): Task {
	return { ...defaults, ...overrides };
}
