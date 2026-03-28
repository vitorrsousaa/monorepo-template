import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculateNextDueDate } from "./date-calculator";
import { RecurrenceService } from "./service";

vi.mock("./date-calculator", () => ({
	calculateNextDueDate: vi.fn(),
}));

const NEXT_DUE_DATE = "2026-04-01";

describe("RecurrenceService", () => {
	const repo = mockTasksRepository();
	const sut = new RecurrenceService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(calculateNextDueDate).mockReturnValue(NEXT_DUE_DATE);
		vi.mocked(repo.create).mockResolvedValue(
			buildTask({ id: "next-task-001" }),
		);
		vi.mocked(repo.updateField).mockResolvedValue(undefined);
		vi.mocked(repo.getByUserId).mockResolvedValue(null);
	});

	it("returns null when recurrence is null", async () => {
		const task = buildTask({ recurrence: null });
		const result = await sut.createNextOccurrence(task);
		expect(result).toBeNull();
	});

	it("returns null when recurrence.enabled is false", async () => {
		const task = buildTask({
			recurrence: {
				enabled: false,
				frequency: "daily",
				endType: "never",
			},
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).toBeNull();
	});

	it("returns null when nextTaskId exists AND next task is pending (duplicate guard)", async () => {
		const pendingNextTask = buildTask({
			id: "existing-next",
			completed: false,
		});
		vi.mocked(repo.getByUserId).mockResolvedValue(pendingNextTask);

		const task = buildTask({
			nextTaskId: "existing-next",
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).toBeNull();
		expect(repo.create).not.toHaveBeenCalled();
	});

	it("creates next task when nextTaskId exists BUT next task is completed (re-creates)", async () => {
		const completedNextTask = buildTask({
			id: "existing-next",
			completed: true,
			completedAt: "2026-03-20T00:00:00.000Z",
		});
		vi.mocked(repo.getByUserId).mockResolvedValue(completedNextTask);

		const task = buildTask({
			nextTaskId: "existing-next",
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).not.toBeNull();
		expect(repo.create).toHaveBeenCalledOnce();
	});

	it("creates next task when nextTaskId is null (first completion)", async () => {
		const task = buildTask({
			nextTaskId: null,
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).not.toBeNull();
		expect(repo.create).toHaveBeenCalledOnce();
	});

	it("next task inherits title, description, priority, projectId, sectionId", async () => {
		const task = buildTask({
			title: "My recurring task",
			description: "Some description",
			priority: "high",
			projectId: "proj-001",
			sectionId: "section-001",
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		await sut.createNextOccurrence(task);

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "My recurring task",
				description: "Some description",
				priority: "high",
				projectId: "proj-001",
				sectionId: "section-001",
			}),
		);
	});

	it("next task has same recurrence rule (for endType=never)", async () => {
		const recurrence = {
			enabled: true,
			frequency: "weekly" as const,
			weeklyDays: [1, 3],
			endType: "never" as const,
		};
		const task = buildTask({ recurrence });
		await sut.createNextOccurrence(task);

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({ recurrence }),
		);
	});

	it("decrements endCount by 1 when endType is after_count", async () => {
		const task = buildTask({
			recurrence: {
				enabled: true,
				frequency: "daily",
				endType: "after_count",
				endCount: 5,
			},
		});
		await sut.createNextOccurrence(task);

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				recurrence: expect.objectContaining({ endCount: 4 }),
			}),
		);
	});

	it("returns null when endType is after_count with endCount === 1 (last occurrence)", async () => {
		const task = buildTask({
			recurrence: {
				enabled: true,
				frequency: "daily",
				endType: "after_count",
				endCount: 1,
			},
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).toBeNull();
		expect(repo.create).not.toHaveBeenCalled();
	});

	it("returns null when endType is on_date and nextDueDate > endDate", async () => {
		vi.mocked(calculateNextDueDate).mockReturnValue("2026-05-01");
		const task = buildTask({
			recurrence: {
				enabled: true,
				frequency: "daily",
				endType: "on_date",
				endDate: "2026-04-30",
			},
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).toBeNull();
		expect(repo.create).not.toHaveBeenCalled();
	});

	it("creates task when endType is on_date and nextDueDate <= endDate", async () => {
		vi.mocked(calculateNextDueDate).mockReturnValue("2026-04-30");
		const task = buildTask({
			recurrence: {
				enabled: true,
				frequency: "daily",
				endType: "on_date",
				endDate: "2026-04-30",
			},
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).not.toBeNull();
		expect(repo.create).toHaveBeenCalledOnce();
	});

	it("always creates next task when endType is never", async () => {
		const task = buildTask({
			recurrence: { enabled: true, frequency: "monthly", endType: "never" },
		});
		const result = await sut.createNextOccurrence(task);
		expect(result).not.toBeNull();
		expect(repo.create).toHaveBeenCalledOnce();
	});

	it("calls repository.updateField to set nextTaskId on completed task", async () => {
		const createdTask = buildTask({ id: "next-task-001" });
		vi.mocked(repo.create).mockResolvedValue(createdTask);

		const task = buildTask({
			id: "task-001",
			userId: "user-001",
			projectId: "proj-001",
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		await sut.createNextOccurrence(task);

		expect(repo.updateField).toHaveBeenCalledWith(
			"task-001",
			"user-001",
			"proj-001",
			"nextTaskId",
			"next-task-001",
		);
	});

	it("calls repository.create with correct arguments", async () => {
		const task = buildTask({
			title: "Daily standup",
			description: null,
			priority: "medium",
			projectId: null,
			sectionId: null,
			userId: "user-42",
			dueDate: "2026-03-27",
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
		await sut.createNextOccurrence(task);

		expect(repo.create).toHaveBeenCalledWith({
			title: "Daily standup",
			description: null,
			priority: "medium",
			projectId: null,
			sectionId: null,
			userId: "user-42",
			dueDate: NEXT_DUE_DATE,
			recurrence: { enabled: true, frequency: "daily", endType: "never" },
		});
	});
});
