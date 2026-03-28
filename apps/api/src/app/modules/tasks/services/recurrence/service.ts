import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks/entities";
import { calculateNextDueDate } from "@repo/contracts/tasks/recurrence";

export class RecurrenceService {
	constructor(private readonly repository: ITasksRepository) {}

	async createNextOccurrence(task: Task): Promise<{ nextTask: Task } | null> {
		// Guard: task must have recurrence enabled
		if (!task.recurrence || !task.recurrence.enabled) {
			return null;
		}

		// Duplicate guard: if nextTaskId exists, check if the next task is still pending
		if (task.nextTaskId) {
			const existingNextTask = await this.repository.getByUserId(
				task.nextTaskId,
				task.userId,
				task.projectId,
			);
			// If a pending (non-completed) next task already exists, skip creation
			if (existingNextTask && !existingNextTask.completed) {
				return null;
			}
			// If it's completed (or not found), continue to re-create
		}

		// Check end conditions before calculating next date
		const recurrence = task.recurrence;

		if (
			recurrence.endType === "after_count" &&
			(recurrence.endCount ?? 0) <= 1
		) {
			return null;
		}

		// Calculate next due date
		const nextDueDate = calculateNextDueDate(task);

		if (recurrence.endType === "on_date" && recurrence.endDate) {
			if (nextDueDate && nextDueDate > recurrence.endDate) {
				return null;
			}
		}

		// Build recurrence for next task
		const nextRecurrence = { ...recurrence };
		if (
			recurrence.endType === "after_count" &&
			recurrence.endCount !== undefined
		) {
			nextRecurrence.endCount = recurrence.endCount - 1;
		}

		// Create next task
		const nextTask = await this.repository.create({
			title: task.title,
			description: task.description,
			priority: task.priority,
			projectId: task.projectId,
			sectionId: task.sectionId,
			userId: task.userId,
			dueDate: nextDueDate ? new Date(nextDueDate).toISOString() : null,
			recurrence: nextRecurrence,
			nextTaskId: null,
		});

		// Link the completed task to its next occurrence
		await this.repository.updateField(
			task.id,
			task.userId,
			task.projectId,
			"nextTaskId",
			nextTask.id,
		);

		return { nextTask };
	}
}
