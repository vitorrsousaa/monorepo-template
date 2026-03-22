import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { GetInboxTasksService } from "./service";

describe("GetInboxTasksService", () => {
	const repo = mockTasksRepository();
	const sut = new GetInboxTasksService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return tasks from repository", async () => {
		const tasks = [buildTask({ title: "Task 1" }), buildTask({ title: "Task 2" })];
		vi.mocked(repo.getInbox).mockResolvedValue(tasks);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.tasks).toHaveLength(2);
		expect(result.total).toBe(2);
		expect(repo.getInbox).toHaveBeenCalledWith("u-1");
	});

	it("should return empty array when no tasks", async () => {
		vi.mocked(repo.getInbox).mockResolvedValue([]);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.tasks).toEqual([]);
		expect(result.total).toBe(0);
	});

	it("should sort by priority (high > medium > low)", async () => {
		const tasks = [
			buildTask({ id: "low", priority: "low" }),
			buildTask({ id: "high", priority: "high" }),
			buildTask({ id: "med", priority: "medium" }),
		];
		vi.mocked(repo.getInbox).mockResolvedValue(tasks);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.tasks[0]!.id).toBe("high");
		expect(result.tasks[1]!.id).toBe("med");
		expect(result.tasks[2]!.id).toBe("low");
	});

	it("should sort by dueDate within same priority (earliest first)", async () => {
		const tasks = [
			buildTask({ id: "later", priority: "high", dueDate: "2024-06-20T00:00:00.000Z" }),
			buildTask({ id: "sooner", priority: "high", dueDate: "2024-06-10T00:00:00.000Z" }),
		];
		vi.mocked(repo.getInbox).mockResolvedValue(tasks);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.tasks[0]!.id).toBe("sooner");
		expect(result.tasks[1]!.id).toBe("later");
	});

	it("should place tasks without dueDate after those with dueDate", async () => {
		const tasks = [
			buildTask({ id: "no-date", priority: "high", dueDate: null }),
			buildTask({ id: "has-date", priority: "high", dueDate: "2024-06-10T00:00:00.000Z" }),
		];
		vi.mocked(repo.getInbox).mockResolvedValue(tasks);

		const result = await sut.execute({ userId: "u-1" });

		expect(result.tasks[0]!.id).toBe("has-date");
		expect(result.tasks[1]!.id).toBe("no-date");
	});
});
