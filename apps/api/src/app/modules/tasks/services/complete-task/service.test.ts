import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { CompleteTaskService } from "./service";

const makeRecurrenceService = () => ({
	createNextOccurrence: vi.fn(),
});

describe("CompleteTaskService", () => {
	const repo = mockTasksRepository();
	const recurrenceService = makeRecurrenceService();
	const sut = new CompleteTaskService(repo, recurrenceService);

	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		recurrenceService.createNextOccurrence.mockResolvedValue(null);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should set completed to true and completedAt to now", async () => {
		const now = new Date("2024-06-15T12:00:00.000Z");
		vi.setSystemTime(now);

		const task = buildTask({ completed: false, completedAt: null });
		vi.mocked(repo.updateCompletion).mockImplementation((_old, updated) =>
			Promise.resolve(updated),
		);

		const result = await sut.execute({ task });

		expect(result.task.completed).toBe(true);
		expect(result.task.completedAt).toBe("2024-06-15T12:00:00.000Z");
		expect(result.task.updatedAt).toBe("2024-06-15T12:00:00.000Z");
	});

	it("should call updateCompletion with old and updated task", async () => {
		const task = buildTask({ completed: false });
		vi.mocked(repo.updateCompletion).mockImplementation((_old, updated) =>
			Promise.resolve(updated),
		);

		await sut.execute({ task });

		expect(repo.updateCompletion).toHaveBeenCalledWith(
			task,
			expect.objectContaining({ completed: true }),
		);
	});

	it("should return the task from repository", async () => {
		const task = buildTask();
		const repoTask = buildTask({ id: "returned" });
		vi.mocked(repo.updateCompletion).mockResolvedValue(repoTask);

		const result = await sut.execute({ task });

		expect(result.task).toEqual(repoTask);
	});

	it("should not include nextTask when task has no recurrence", async () => {
		const task = buildTask({ recurrence: null });
		vi.mocked(repo.updateCompletion).mockImplementation((_old, updated) =>
			Promise.resolve(updated),
		);
		recurrenceService.createNextOccurrence.mockResolvedValue(null);

		const result = await sut.execute({ task });

		expect(result.nextTask).toBeUndefined();
	});

	it("should include nextTask when recurrenceService returns one", async () => {
		const task = buildTask({
			recurrence: {
				enabled: true,
				frequency: "daily",
				endType: "never",
			},
		});
		const nextTask = buildTask({ id: "next-task-id" });
		vi.mocked(repo.updateCompletion).mockImplementation((_old, updated) =>
			Promise.resolve(updated),
		);
		recurrenceService.createNextOccurrence.mockResolvedValue({ nextTask });

		const result = await sut.execute({ task });

		expect(result.nextTask).toEqual(nextTask);
	});

	it("should call recurrenceService.createNextOccurrence with the completed task", async () => {
		const task = buildTask({ completed: false });
		const completedTask = buildTask({ id: task.id, completed: true });
		vi.mocked(repo.updateCompletion).mockResolvedValue(completedTask);

		await sut.execute({ task });

		expect(recurrenceService.createNextOccurrence).toHaveBeenCalledWith(
			completedTask,
		);
	});
});
