import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks/entities";
import { calculateNextDueDate } from "@repo/contracts/tasks/recurrence";

export class RecurrenceService {
	constructor(private readonly repository: ITasksRepository) {}

	async createNextOccurrence(task: Task): Promise<{ nextTask: Task } | null> {
		if (!task.recurrence?.enabled) {
			return null;
		}

		if (await this.hasPendingNextTask(task)) {
			return null;
		}

		const recurrence = task.recurrence;

		if (this.isRecurrenceExhausted(recurrence)) {
			return null;
		}

		const nextDueDate = calculateNextDueDate(task);

		if (this.isNextDatePastEnd(recurrence, nextDueDate)) {
			return null;
		}

		const nextRecurrence = this.buildNextRecurrence(recurrence);

		const nextTask = await this.repository.create({
			title: task.title,
			description: task.description,
			priority: task.priority,
			projectId: task.projectId,
			sectionId: task.sectionId,
			userId: task.userId,
			dueDate: nextDueDate,
			recurrence: nextRecurrence,
			nextTaskId: null,
		});

		await this.repository.updateField(
			task.id,
			task.userId,
			task.projectId,
			"nextTaskId",
			nextTask.id,
		);

		return { nextTask };
	}

	private async hasPendingNextTask(task: Task): Promise<boolean> {
		if (!task.nextTaskId) return false;

		const existing = await this.repository.getByUserId(
			task.nextTaskId,
			task.userId,
			task.projectId,
		);
		return existing !== null && !existing.completed;
	}

	private isRecurrenceExhausted(
		recurrence: NonNullable<Task["recurrence"]>,
	): boolean {
		return (
			recurrence.endType === "after_count" && (recurrence.endCount ?? 0) <= 1
		);
	}

	private isNextDatePastEnd(
		recurrence: NonNullable<Task["recurrence"]>,
		nextDueDate: string | null,
	): boolean {
		return (
			recurrence.endType === "on_date" &&
			!!recurrence.endDate &&
			!!nextDueDate &&
			nextDueDate > recurrence.endDate
		);
	}

	private buildNextRecurrence(
		recurrence: NonNullable<Task["recurrence"]>,
	): NonNullable<Task["recurrence"]> {
		const next = { ...recurrence };
		if (
			recurrence.endType === "after_count" &&
			recurrence.endCount !== undefined
		) {
			next.endCount = recurrence.endCount - 1;
		}
		return next;
	}
}
