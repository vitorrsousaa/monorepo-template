import type { IService } from "@application/interfaces/service";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks";
import { TaskNotFound } from "../../errors/task-not-found";
import type { UpdateTaskServiceInput, UpdateTaskServiceOutput } from "./dto";

export interface IUpdateTaskService
	extends IService<UpdateTaskServiceInput, UpdateTaskServiceOutput> {}

export class UpdateTaskService implements IUpdateTaskService {
	constructor(private readonly repository: ITasksRepository) {}

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

		const updates: Partial<
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
		> = {};

		if (input.title !== undefined) {
			updates.title = input.title;
		}

		if (input.description !== undefined) {
			updates.description = input.description ?? null;
		}

		if (input.priority !== undefined) {
			updates.priority = input.priority ?? null;
		}

		if (input.dueDate !== undefined) {
			updates.dueDate = input.dueDate ?? null;
		}

		if (input.projectId !== undefined) {
			updates.projectId = input.projectId ?? null;
		}

		if (input.sectionId !== undefined) {
			updates.sectionId = input.sectionId ?? null;
		}

		if (input.recurrence !== undefined) {
			if (input.recurrence === null || input.recurrence.enabled === false) {
				updates.recurrence = null;
			} else {
				updates.recurrence = input.recurrence;
			}
		}

		const updatedTask = await this.repository.updateTask(currentTask, updates);

		return { task: updatedTask };
	}
}
