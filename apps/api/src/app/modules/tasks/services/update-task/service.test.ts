import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { TaskNotFound } from "../../errors/task-not-found";
import { UpdateTaskService } from "./service";

describe("UpdateTaskService", () => {
	const repo = mockTasksRepository();
	const sut = new UpdateTaskService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should update title successfully", async () => {
		const existingTask = buildTask({ id: "t-1", title: "Old title" });
		const updatedTask = buildTask({ id: "t-1", title: "New title" });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		const result = await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			title: "New title",
		});

		expect(result.task.title).toBe("New title");
		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ title: "New title" }),
		);
	});

	it("should update description with a value", async () => {
		const existingTask = buildTask({ id: "t-1", description: null });
		const updatedTask = buildTask({ id: "t-1", description: "My description" });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			description: "My description",
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ description: "My description" }),
		);
	});

	it("should update description to null", async () => {
		const existingTask = buildTask({ id: "t-1", description: "Old desc" });
		const updatedTask = buildTask({ id: "t-1", description: null });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			description: null,
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ description: null }),
		);
	});

	it("should update priority with a value", async () => {
		const existingTask = buildTask({ id: "t-1", priority: null });
		const updatedTask = buildTask({ id: "t-1", priority: "high" });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			priority: "high",
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ priority: "high" }),
		);
	});

	it("should update priority to null", async () => {
		const existingTask = buildTask({ id: "t-1", priority: "medium" });
		const updatedTask = buildTask({ id: "t-1", priority: null });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			priority: null,
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ priority: null }),
		);
	});

	it("should update dueDate with a value", async () => {
		const existingTask = buildTask({ id: "t-1", dueDate: null });
		const updatedTask = buildTask({ id: "t-1", dueDate: "2026-04-01" });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			dueDate: "2026-04-01",
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ dueDate: "2026-04-01" }),
		);
	});

	it("should update dueDate to null", async () => {
		const existingTask = buildTask({ id: "t-1", dueDate: "2026-03-27" });
		const updatedTask = buildTask({ id: "t-1", dueDate: null });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			dueDate: null,
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ dueDate: null }),
		);
	});

	it("should add recurrence to a task that had none", async () => {
		const recurrence = {
			enabled: true,
			frequency: "daily" as const,
			endType: "never" as const,
		};
		const existingTask = buildTask({ id: "t-1", recurrence: null });
		const updatedTask = buildTask({ id: "t-1", recurrence });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			recurrence,
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ recurrence }),
		);
	});

	it("should modify existing recurrence frequency", async () => {
		const existingRecurrence = {
			enabled: true,
			frequency: "daily" as const,
			endType: "never" as const,
		};
		const newRecurrence = {
			enabled: true,
			frequency: "weekly" as const,
			weeklyDays: [1, 3, 5],
			endType: "never" as const,
		};
		const existingTask = buildTask({
			id: "t-1",
			recurrence: existingRecurrence,
		});
		const updatedTask = buildTask({ id: "t-1", recurrence: newRecurrence });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			recurrence: newRecurrence,
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ recurrence: newRecurrence }),
		);
	});

	it("should remove recurrence when recurrence is null", async () => {
		const existingTask = buildTask({
			id: "t-1",
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		const updatedTask = buildTask({ id: "t-1", recurrence: null });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			recurrence: null,
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ recurrence: null }),
		);
	});

	it("should remove recurrence when recurrence.enabled is false", async () => {
		const existingTask = buildTask({
			id: "t-1",
			recurrence: { enabled: true, frequency: "weekly", endType: "never" },
		});
		const updatedTask = buildTask({ id: "t-1", recurrence: null });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			recurrence: { enabled: false, frequency: "weekly", endType: "never" },
		});

		expect(repo.updateTask).toHaveBeenCalledWith(
			existingTask,
			expect.objectContaining({ recurrence: null }),
		);
	});

	it("should throw TaskNotFound when task does not exist", async () => {
		vi.mocked(repo.getByUserId).mockResolvedValue(null);

		await expect(
			sut.execute({ taskId: "nonexistent", userId: "u-1" }),
		).rejects.toThrow(TaskNotFound);
	});

	it("should call repository.updateTask with correct arguments", async () => {
		const existingTask = buildTask({ id: "t-1", userId: "u-1" });
		const updatedTask = buildTask({ id: "t-1", title: "Updated" });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			title: "Updated",
		});

		expect(repo.getByUserId).toHaveBeenCalledWith("t-1", "u-1", undefined);
		expect(repo.updateTask).toHaveBeenCalledWith(existingTask, {
			title: "Updated",
		});
	});

	it("should not include fields in updates that were not provided", async () => {
		const existingTask = buildTask({ id: "t-1" });
		const updatedTask = buildTask({ id: "t-1", title: "Only title updated" });

		vi.mocked(repo.getByUserId).mockResolvedValue(existingTask);
		vi.mocked(repo.updateTask).mockResolvedValue(updatedTask);

		await sut.execute({
			taskId: "t-1",
			userId: "u-1",
			title: "Only title updated",
		});

		expect(repo.updateTask).toHaveBeenCalledTimes(1);
		const callArgs = vi.mocked(repo.updateTask).mock.calls[0]?.[1];
		expect(callArgs).toBeDefined();
		expect(callArgs).toEqual({ title: "Only title updated" });
		expect(callArgs).not.toHaveProperty("description");
		expect(callArgs).not.toHaveProperty("priority");
		expect(callArgs).not.toHaveProperty("dueDate");
		expect(callArgs).not.toHaveProperty("recurrence");
	});
});
