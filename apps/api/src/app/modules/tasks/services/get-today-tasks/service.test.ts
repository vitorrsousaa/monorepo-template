import { buildProject, buildTask } from "@test/builders";
import { mockProjectsRepository, mockTasksRepository } from "@test/mocks";
import { GetTodayTasksService } from "./service";

describe("GetTodayTasksService", () => {
	const taskRepo = mockTasksRepository();
	const projectRepo = mockProjectsRepository();
	const sut = new GetTodayTasksService(taskRepo, projectRepo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return empty projects when no tasks", async () => {
		vi.mocked(taskRepo.getTodayTasks).mockResolvedValue([]);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toEqual([]);
	});

	it("should group inbox tasks under 'Inbox' project", async () => {
		const tasks = [
			buildTask({ id: "t-1", projectId: null }),
			buildTask({ id: "t-2", projectId: null }),
		];
		vi.mocked(taskRepo.getTodayTasks).mockResolvedValue(tasks);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(1);
		expect(result.projects[0]?.id).toBe("inbox");
		expect(result.projects[0]?.name).toBe("Inbox");
		expect(result.projects[0]?.tasks).toHaveLength(2);
	});

	it("should group project tasks and fetch project names", async () => {
		const tasks = [
			buildTask({ id: "t-1", projectId: "p-1" }),
			buildTask({ id: "t-2", projectId: "p-1" }),
		];
		vi.mocked(taskRepo.getTodayTasks).mockResolvedValue(tasks);
		vi.mocked(projectRepo.getById).mockResolvedValue(
			buildProject({ id: "p-1", name: "Work" }),
		);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(1);
		expect(result.projects[0]?.name).toBe("Work");
		expect(result.projects[0]?.tasks).toHaveLength(2);
	});

	it("should put Inbox first, then projects sorted by name", async () => {
		const tasks = [
			buildTask({ id: "t-1", projectId: null }),
			buildTask({ id: "t-2", projectId: "p-2" }),
			buildTask({ id: "t-3", projectId: "p-1" }),
		];
		vi.mocked(taskRepo.getTodayTasks).mockResolvedValue(tasks);
		vi.mocked(projectRepo.getById).mockImplementation((projectId: string) => {
			if (projectId === "p-1")
				return Promise.resolve(buildProject({ id: "p-1", name: "Alpha" }));
			return Promise.resolve(buildProject({ id: "p-2", name: "Beta" }));
		});

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(3);
		expect(result.projects[0]?.name).toBe("Inbox");
		expect(result.projects[1]?.name).toBe("Alpha");
		expect(result.projects[2]?.name).toBe("Beta");
	});

	it("should use 'Unknown' for project name when project not found", async () => {
		const tasks = [buildTask({ id: "t-1", projectId: "p-missing" })];
		vi.mocked(taskRepo.getTodayTasks).mockResolvedValue(tasks);
		vi.mocked(projectRepo.getById).mockResolvedValue(null);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects[0]?.name).toBe("Unknown");
	});
});
