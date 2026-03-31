import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";

export function mockTasksRepository(
	overrides?: Partial<ITasksRepository>,
): ITasksRepository {
	return {
		getInbox: vi.fn(),
		create: vi.fn(),
		getTodayTasks: vi.fn(),
		findAll: vi.fn(),
		findById: vi.fn(),
		delete: vi.fn(),
		getAllBySection: vi.fn(),
		getTodosByProjectWithoutSection: vi.fn(),
		getAllPendingByProject: vi.fn(),
		getTaskCountsByProject: vi.fn(),
		getByUserId: vi.fn(),
		updateCompletion: vi.fn(),
		updateTask: vi.fn(),
		updateField: vi.fn(),
		...overrides,
	};
}
