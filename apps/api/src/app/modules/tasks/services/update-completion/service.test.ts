import { TaskNotFound } from "@application/modules/tasks/errors/task-not-found";
import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import type { ICompleteTaskService } from "../complete-task";
import type { IUncompleteTaskService } from "../uncomplete-task";
import { UpdateTaskCompletionService } from "./service";

describe("UpdateTaskCompletionService", () => {
	const repo = mockTasksRepository();
	const completeService: ICompleteTaskService = { execute: vi.fn() };
	const uncompleteService: IUncompleteTaskService = { execute: vi.fn() };
	const sut = new UpdateTaskCompletionService(
		repo,
		completeService,
		uncompleteService,
	);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should throw TaskNotFound when task does not exist", async () => {
		vi.mocked(repo.getByUserId).mockResolvedValue(null);

		await expect(
			sut.execute({ taskId: "t-1", userId: "u-1" }),
		).rejects.toThrow(TaskNotFound);
	});

	it("should delegate to completeService when task is pending", async () => {
		const task = buildTask({ completed: false });
		vi.mocked(repo.getByUserId).mockResolvedValue(task);
		vi.mocked(completeService.execute).mockResolvedValue({ task });

		await sut.execute({ taskId: "t-1", userId: "u-1" });

		expect(completeService.execute).toHaveBeenCalledWith({ task });
		expect(uncompleteService.execute).not.toHaveBeenCalled();
	});

	it("should delegate to uncompleteService when task is already completed", async () => {
		const task = buildTask({ completed: true });
		vi.mocked(repo.getByUserId).mockResolvedValue(task);
		vi.mocked(uncompleteService.execute).mockResolvedValue({ task });

		await sut.execute({ taskId: "t-1", userId: "u-1" });

		expect(uncompleteService.execute).toHaveBeenCalledWith({ task });
		expect(completeService.execute).not.toHaveBeenCalled();
	});

	it("should pass projectId to getByUserId", async () => {
		const task = buildTask({ completed: false });
		vi.mocked(repo.getByUserId).mockResolvedValue(task);
		vi.mocked(completeService.execute).mockResolvedValue({ task });

		await sut.execute({ taskId: "t-1", userId: "u-1", projectId: "p-1" });

		expect(repo.getByUserId).toHaveBeenCalledWith("t-1", "u-1", "p-1");
	});

	it("should pass null projectId when not provided", async () => {
		const task = buildTask({ completed: false });
		vi.mocked(repo.getByUserId).mockResolvedValue(task);
		vi.mocked(completeService.execute).mockResolvedValue({ task });

		await sut.execute({ taskId: "t-1", userId: "u-1" });

		expect(repo.getByUserId).toHaveBeenCalledWith("t-1", "u-1", null);
	});
});
