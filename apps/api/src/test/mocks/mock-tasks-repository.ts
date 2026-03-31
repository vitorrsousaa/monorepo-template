import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";

export function mockTasksRepository(
	overrides?: Partial<ITasksRepository>,
): ITasksRepository {
	return {
		getInbox: vi.fn(),
		create: vi.fn(),
		getTodayTasks: vi.fn(),
		getAllPendingByProject: vi.fn(),
		getTaskCountsByProject: vi.fn(),
		getByUserId: vi.fn(),
		updateCompletion: vi.fn(),
		updateTask: vi.fn(),
		updateField: vi.fn(),
		...overrides,
	};
}
