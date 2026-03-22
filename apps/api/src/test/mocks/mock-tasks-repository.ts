import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";

export function mockTasksRepository(
	overrides?: Partial<ITasksRepository>,
): ITasksRepository {
	return {
		getInbox: vi.fn(),
		create: vi.fn(),
		findTodayTodos: vi.fn(),
		findAll: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		getAllBySection: vi.fn(),
		getTodosByProjectWithoutSection: vi.fn(),
		getAllPendingByProject: vi.fn(),
		getTaskCountsByProject: vi.fn(),
		getByUserId: vi.fn(),
		updateCompletion: vi.fn(),
		...overrides,
	};
}
