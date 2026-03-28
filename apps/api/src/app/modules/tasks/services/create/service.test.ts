import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { CreateTasksService } from "./service";

describe("CreateTasksService", () => {
	const repo = mockTasksRepository();
	const sut = new CreateTasksService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create task with required fields", async () => {
		const createdTask = buildTask({ title: "New task" });
		vi.mocked(repo.create).mockResolvedValue(createdTask);

		const result = await sut.execute({
			userId: "u-1",
			title: "New task",
		});

		expect(result.task).toEqual(createdTask);
		expect(repo.create).toHaveBeenCalledWith({
			userId: "u-1",
			title: "New task",
			description: null,
			priority: null,
			dueDate: null,
			projectId: null,
			sectionId: null,
			recurrence: null,
		});
	});

	it("should pass optional fields when provided", async () => {
		const createdTask = buildTask();
		vi.mocked(repo.create).mockResolvedValue(createdTask);

		await sut.execute({
			userId: "u-1",
			title: "Task",
			description: "desc",
			priority: "high",
			dueDate: "2024-06-15",
			projectId: "p-1",
			sectionId: "s-1",
		});

		expect(repo.create).toHaveBeenCalledWith({
			userId: "u-1",
			title: "Task",
			description: "desc",
			priority: "high",
			dueDate: "2024-06-15",
			projectId: "p-1",
			sectionId: "s-1",
			recurrence: null,
		});
	});

	it("should default optional fields to null", async () => {
		vi.mocked(repo.create).mockResolvedValue(buildTask());

		await sut.execute({ userId: "u-1", title: "Minimal" });

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				description: null,
				priority: null,
				dueDate: null,
				projectId: null,
				sectionId: null,
				recurrence: null,
			}),
		);
	});

	it("should pass recurrence through to repository when provided", async () => {
		const recurrence = {
			enabled: true,
			frequency: "daily" as const,
			endType: "never" as const,
		};
		vi.mocked(repo.create).mockResolvedValue(buildTask({ recurrence }));

		await sut.execute({
			userId: "u-1",
			title: "Recurring task",
			recurrence,
		});

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({ recurrence }),
		);
	});

	it("should pass recurrence: null to repository when not provided", async () => {
		vi.mocked(repo.create).mockResolvedValue(buildTask());

		await sut.execute({ userId: "u-1", title: "No recurrence" });

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({ recurrence: null }),
		);
	});
});
