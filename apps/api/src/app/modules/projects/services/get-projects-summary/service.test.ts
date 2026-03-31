import { buildProject } from "@test/builders";
import { mockProjectsRepository, mockTasksRepository } from "@test/mocks";
import { GetProjectsSummaryService } from "./service";

describe("GetProjectsSummaryService", () => {
	const projectsRepo = mockProjectsRepository();
	const tasksRepo = mockTasksRepository();
	const sut = new GetProjectsSummaryService(projectsRepo, tasksRepo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return projects with task counts and percentage", async () => {
		const project1 = buildProject({ id: "p-1", name: "Project 1" });
		const project2 = buildProject({ id: "p-2", name: "Project 2" });

		vi.mocked(projectsRepo.getAllProjectsByUser).mockResolvedValue([
			project1,
			project2,
		]);
		vi.mocked(tasksRepo.getTaskCountsByProject)
			.mockResolvedValueOnce({ pending: 3, completed: 7 })
			.mockResolvedValueOnce({ pending: 5, completed: 5 });

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toHaveLength(2);
		expect(result.projects[0]).toEqual({
			...project1,
			completedCount: 7,
			totalCount: 10,
			percentageCompleted: 70,
		});
		expect(result.projects[1]).toEqual({
			...project2,
			completedCount: 5,
			totalCount: 10,
			percentageCompleted: 50,
		});
	});

	it("should return empty projects list when user has no projects", async () => {
		vi.mocked(projectsRepo.getAllProjectsByUser).mockResolvedValue([]);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects).toEqual([]);
		expect(tasksRepo.getTaskCountsByProject).not.toHaveBeenCalled();
	});

	it("should handle project with zero tasks", async () => {
		const project = buildProject({ id: "p-1", name: "Empty Project" });

		vi.mocked(projectsRepo.getAllProjectsByUser).mockResolvedValue([project]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 0,
			completed: 0,
		});

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects[0]).toEqual({
			...project,
			completedCount: 0,
			totalCount: 0,
			percentageCompleted: 0,
		});
	});

	it("should round percentage correctly", async () => {
		const project = buildProject({ id: "p-1" });

		vi.mocked(projectsRepo.getAllProjectsByUser).mockResolvedValue([project]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 2,
			completed: 1,
		});

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects[0].completedCount).toBe(1);
		expect(result.projects[0].totalCount).toBe(3);
		expect(result.projects[0].percentageCompleted).toBe(33);
	});

	it("should call getTaskCountsByProject once per project", async () => {
		const project1 = buildProject({ id: "p-1" });
		const project2 = buildProject({ id: "p-2" });
		const project3 = buildProject({ id: "p-3" });

		vi.mocked(projectsRepo.getAllProjectsByUser).mockResolvedValue([
			project1,
			project2,
			project3,
		]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 0,
			completed: 0,
		});

		await sut.execute({ userId: "u-1" });

		expect(tasksRepo.getTaskCountsByProject).toHaveBeenCalledTimes(3);
		expect(tasksRepo.getTaskCountsByProject).toHaveBeenCalledWith("p-1", "u-1");
		expect(tasksRepo.getTaskCountsByProject).toHaveBeenCalledWith("p-2", "u-1");
		expect(tasksRepo.getTaskCountsByProject).toHaveBeenCalledWith("p-3", "u-1");
	});

	it("should preserve all project fields in summary", async () => {
		const project = buildProject({
			id: "p-1",
			name: "Test Project",
			description: "A test project",
			color: "#7F77DD",
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-01-02T00:00:00.000Z",
		});

		vi.mocked(projectsRepo.getAllProjectsByUser).mockResolvedValue([project]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 1,
			completed: 1,
		});

		const result = await sut.execute({ userId: "u-1" });

		expect(result.projects[0]).toMatchObject({
			id: "p-1",
			name: "Test Project",
			description: "A test project",
			color: "#7F77DD",
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-01-02T00:00:00.000Z",
		});
	});
});
