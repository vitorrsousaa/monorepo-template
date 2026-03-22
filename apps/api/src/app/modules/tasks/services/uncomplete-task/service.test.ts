import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { UncompleteTaskService } from "./service";

describe("UncompleteTaskService", () => {
	const repo = mockTasksRepository();
	const sut = new UncompleteTaskService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should set completed to false and completedAt to null", async () => {
		const now = new Date("2024-06-15T12:00:00.000Z");
		vi.setSystemTime(now);

		const task = buildTask({
			completed: true,
			completedAt: "2024-06-10T00:00:00.000Z",
		});
		vi.mocked(repo.updateCompletion).mockImplementation((_old, updated) =>
			Promise.resolve(updated),
		);

		const result = await sut.execute({ task });

		expect(result.task.completed).toBe(false);
		expect(result.task.completedAt).toBeNull();
		expect(result.task.updatedAt).toBe("2024-06-15T12:00:00.000Z");
	});

	it("should call updateCompletion with old and updated task", async () => {
		const task = buildTask({ completed: true });
		vi.mocked(repo.updateCompletion).mockImplementation((_old, updated) =>
			Promise.resolve(updated),
		);

		await sut.execute({ task });

		expect(repo.updateCompletion).toHaveBeenCalledWith(
			task,
			expect.objectContaining({ completed: false, completedAt: null }),
		);
	});
});
