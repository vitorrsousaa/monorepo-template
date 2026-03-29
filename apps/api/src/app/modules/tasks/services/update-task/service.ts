import type { IService } from "@application/interfaces/service";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks";
import { TaskNotFound } from "../../errors/task-not-found";
import type { UpdateTaskServiceInput, UpdateTaskServiceOutput } from "./dto";

export interface IUpdateTaskService
	extends IService<UpdateTaskServiceInput, UpdateTaskServiceOutput> {}

export class UpdateTaskService implements IUpdateTaskService {
	constructor(private readonly repository: ITasksRepository) {}

	private static readonly NULLABLE_FIELDS = [
		"description",
		"priority",
		"dueDate",
		"projectId",
		"sectionId",
	] as const;

	async execute(
		input: UpdateTaskServiceInput,
	): Promise<UpdateTaskServiceOutput> {
		const currentTask = await this.repository.getByUserId(
			input.taskId,
			input.userId,
			input.projectId,
		);

		if (!currentTask) {
			throw new TaskNotFound();
		}

		const updates = this.buildUpdates(input);
		const updatedTask = await this.repository.updateTask(currentTask, updates);

		return { task: updatedTask };
	}

	private buildUpdates(
		input: UpdateTaskServiceInput,
	): Partial<
		Pick<
			Task,
			| "title"
			| "description"
			| "priority"
			| "dueDate"
			| "recurrence"
			| "sectionId"
			| "projectId"
		>
	> {
		const updates: Record<string, unknown> = {};

		if (input.title !== undefined) {
			updates.title = input.title;
		}

		for (const field of UpdateTaskService.NULLABLE_FIELDS) {
			if (input[field] !== undefined) {
				updates[field] = input[field] ?? null;
			}
		}

		if (input.recurrence !== undefined) {
			updates.recurrence = this.resolveRecurrence(input.recurrence);
		}

		return updates;
	}

	private resolveRecurrence(
		recurrence: UpdateTaskServiceInput["recurrence"],
	): Task["recurrence"] {
		if (recurrence === null || recurrence?.enabled === false) {
			return null;
		}
		return recurrence ?? null;
	}
}
