import {
	PROJECTS_DEFAULT_IDS,
	SECTION_DEFAULT_NAMES,
} from "@repo/contracts/enums";
import { buildProject, buildSection, buildTask } from "@test/builders";
import {
	mockProjectsRepository,
	mockSectionsRepository,
	mockTasksRepository,
} from "@test/mocks";
import { ProjectNotFound } from "../../errors/project-not-found";
import { GetProjectDetailService } from "./service";

describe("GetProjectDetailService", () => {
	const projectsRepo = mockProjectsRepository();
	const sectionsRepo = mockSectionsRepository();
	const tasksRepo = mockTasksRepository();
	const sut = new GetProjectDetailService(
		projectsRepo,
		sectionsRepo,
		tasksRepo,
	);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should throw ProjectNotFound when project does not exist", async () => {
		vi.mocked(projectsRepo.getById).mockResolvedValue(null);

		await expect(
			sut.execute({ projectId: "p-1", userId: "u-1" }),
		).rejects.toThrow(ProjectNotFound);

		expect(projectsRepo.getById).toHaveBeenCalledWith("p-1", "u-1");
	});

	it("should return project with sections and tasks grouped correctly", async () => {
		const project = buildProject({ id: "p-1", name: "Test Project" });
		const section1 = buildSection({ id: "s-1", name: "Section 1", order: 1 });
		const section2 = buildSection({ id: "s-2", name: "Section 2", order: 2 });
		const task1 = buildTask({ id: "t-1", sectionId: "s-1", title: "Task 1" });
		const task2 = buildTask({ id: "t-2", sectionId: "s-2", title: "Task 2" });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([
			section1,
			section2,
		]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([
			task1,
			task2,
		]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 2,
			completed: 0,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		expect(result.data.project.id).toBe("p-1");
		expect(result.data.sections).toHaveLength(3); // inbox + 2 sections
		expect(result.data.sections[0].id).toBe(PROJECTS_DEFAULT_IDS.INBOX);
		expect(result.data.sections[0].name).toBe(
			SECTION_DEFAULT_NAMES.UNSECTIONED,
		);
		expect(result.data.sections[1]).toEqual({ ...section1, tasks: [task1] });
		expect(result.data.sections[2]).toEqual({ ...section2, tasks: [task2] });
	});

	it("should place tasks without sectionId in the synthetic inbox section", async () => {
		const project = buildProject({ id: "p-1" });
		const section1 = buildSection({ id: "s-1", name: "Section 1" });
		const taskWithSection = buildTask({ id: "t-1", sectionId: "s-1" });
		const taskWithoutSection = buildTask({ id: "t-2", sectionId: null });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([section1]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([
			taskWithSection,
			taskWithoutSection,
		]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 2,
			completed: 0,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		const inboxSection = result.data.sections[0];
		expect(inboxSection.id).toBe(PROJECTS_DEFAULT_IDS.INBOX);
		expect(inboxSection.tasks).toEqual([taskWithoutSection]);

		const regularSection = result.data.sections[1];
		expect(regularSection.tasks).toEqual([taskWithSection]);
	});

	it("should return empty sections array when project has no sections or tasks", async () => {
		const project = buildProject({ id: "p-1" });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 0,
			completed: 0,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		expect(result.data.sections).toHaveLength(1); // only synthetic inbox
		expect(result.data.sections[0].id).toBe(PROJECTS_DEFAULT_IDS.INBOX);
		expect(result.data.sections[0].tasks).toEqual([]);
	});

	it("should group multiple tasks in the same section", async () => {
		const project = buildProject({ id: "p-1" });
		const section = buildSection({ id: "s-1", name: "Section 1" });
		const task1 = buildTask({ id: "t-1", sectionId: "s-1", title: "Task 1" });
		const task2 = buildTask({ id: "t-2", sectionId: "s-1", title: "Task 2" });
		const task3 = buildTask({ id: "t-3", sectionId: "s-1", title: "Task 3" });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([section]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([
			task1,
			task2,
			task3,
		]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 3,
			completed: 0,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		const regularSection = result.data.sections[1];
		expect(regularSection.tasks).toHaveLength(3);
		expect(regularSection.tasks).toEqual([task1, task2, task3]);
	});

	it("should calculate percentage correctly based on task counts", async () => {
		const project = buildProject({ id: "p-1" });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 3,
			completed: 7,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		expect(result.data.project.completedCount).toBe(7);
		expect(result.data.project.totalCount).toBe(10);
		expect(result.data.project.percentageCompleted).toBe(70);
	});

	it("should return 0 percentage when total tasks is zero", async () => {
		const project = buildProject({ id: "p-1" });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 0,
			completed: 0,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		expect(result.data.project.percentageCompleted).toBe(0);
	});

	it("should preserve sections order after synthetic inbox section", async () => {
		const project = buildProject({ id: "p-1" });
		const section1 = buildSection({ id: "s-1", name: "First", order: 1 });
		const section2 = buildSection({ id: "s-2", name: "Second", order: 2 });
		const section3 = buildSection({ id: "s-3", name: "Third", order: 3 });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([
			section1,
			section2,
			section3,
		]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 0,
			completed: 0,
		});

		const result = await sut.execute({ projectId: "p-1", userId: "u-1" });

		expect(result.data.sections[0].id).toBe(PROJECTS_DEFAULT_IDS.INBOX);
		expect(result.data.sections[1].name).toBe("First");
		expect(result.data.sections[2].name).toBe("Second");
		expect(result.data.sections[3].name).toBe("Third");
	});

	it("should call all 4 parallel queries with correct parameters", async () => {
		const project = buildProject({ id: "p-1" });

		vi.mocked(projectsRepo.getById).mockResolvedValue(project);
		vi.mocked(sectionsRepo.getAllByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getAllPendingByProject).mockResolvedValue([]);
		vi.mocked(tasksRepo.getTaskCountsByProject).mockResolvedValue({
			pending: 0,
			completed: 0,
		});

		await sut.execute({ projectId: "p-1", userId: "u-1" });

		expect(projectsRepo.getById).toHaveBeenCalledWith("p-1", "u-1");
		expect(sectionsRepo.getAllByProject).toHaveBeenCalledWith("p-1", "u-1");
		expect(tasksRepo.getAllPendingByProject).toHaveBeenCalledWith("p-1", "u-1");
		expect(tasksRepo.getTaskCountsByProject).toHaveBeenCalledWith("p-1", "u-1");
	});
});
