import { buildProject } from "@test/builders";
import { mockProjectsRepository } from "@test/mocks";
import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
import type { Todo } from "@core/domain/todo/todo";
import { GetTodayTasksService } from "./service";

function buildTodo(overrides?: Partial<Todo>): Todo {
	return {
		id: "todo-001",
		userId: "user-001",
		projectId: null,
		sectionId: null,
		title: "Test todo",
		description: "",
		completed: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		order: 0,
		completedAt: null,
		dueDate: null,
		priority: null,
		...overrides,
	};
}

function mockTodoRepository(
	overrides?: Partial<ITodoRepository>,
): ITodoRepository {
	return {
		findInboxTodos: vi.fn(),
		findTodayTodos: vi.fn(),
		findAll: vi.fn(),
		findById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		getAllBySection: vi.fn(),
		getTodosByProjectWithoutSection: vi.fn(),
		...overrides,
	};
}

describe("GetTodayTasksService", () => {
	const todoRepo = mockTodoRepository();
	const projectRepo = mockProjectsRepository();
	const sut = new GetTodayTasksService(todoRepo, projectRepo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return empty projects when no todos", async () => {
		vi.mocked(todoRepo.findTodayTodos).mockResolvedValue([]);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toEqual([]);
	});

	it("should group inbox todos under 'Inbox' project", async () => {
		const todos = [
			buildTodo({ id: "t-1", projectId: null }),
			buildTodo({ id: "t-2", projectId: null }),
		];
		vi.mocked(todoRepo.findTodayTodos).mockResolvedValue(todos);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(1);
		expect(result.projects[0]!.id).toBe("inbox");
		expect(result.projects[0]!.name).toBe("Inbox");
		expect(result.projects[0]!.tasks).toHaveLength(2);
	});

	it("should group project todos and fetch project names", async () => {
		const todos = [
			buildTodo({ id: "t-1", projectId: "p-1" }),
			buildTodo({ id: "t-2", projectId: "p-1" }),
		];
		vi.mocked(todoRepo.findTodayTodos).mockResolvedValue(todos);
		vi.mocked(projectRepo.getById).mockResolvedValue(
			buildProject({ id: "p-1", name: "Work" }),
		);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(1);
		expect(result.projects[0]!.name).toBe("Work");
		expect(result.projects[0]!.tasks).toHaveLength(2);
	});

	it("should put Inbox first, then projects sorted by name", async () => {
		const todos = [
			buildTodo({ id: "t-1", projectId: null }),
			buildTodo({ id: "t-2", projectId: "p-2" }),
			buildTodo({ id: "t-3", projectId: "p-1" }),
		];
		vi.mocked(todoRepo.findTodayTodos).mockResolvedValue(todos);
		vi.mocked(projectRepo.getById).mockImplementation(
			(projectId: string) => {
				if (projectId === "p-1")
					return Promise.resolve(
						buildProject({ id: "p-1", name: "Alpha" }),
					);
				return Promise.resolve(
					buildProject({ id: "p-2", name: "Beta" }),
				);
			},
		);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(3);
		expect(result.projects[0]!.name).toBe("Inbox");
		expect(result.projects[1]!.name).toBe("Alpha");
		expect(result.projects[2]!.name).toBe("Beta");
	});

	it("should use 'Unknown' for project name when project not found", async () => {
		const todos = [buildTodo({ id: "t-1", projectId: "p-missing" })];
		vi.mocked(todoRepo.findTodayTodos).mockResolvedValue(todos);
		vi.mocked(projectRepo.getById).mockResolvedValue(null);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects[0]!.name).toBe("Unknown");
	});
});
