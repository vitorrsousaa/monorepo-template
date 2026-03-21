import type { IService } from "@application/interfaces/service";
import { TaskNotFound } from "@application/modules/tasks/errors/task-not-found";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { ICompleteTaskService } from "../complete-task";
import type { IUncompleteTaskService } from "../uncomplete-task";
import type {
	UpdateTaskCompletionInputService,
	UpdateTaskCompletionOutputService,
} from "./dto";

export interface IUpdateTaskCompletionService
	extends IService<
		UpdateTaskCompletionInputService,
		UpdateTaskCompletionOutputService
	> {}

export class UpdateTaskCompletionService
	implements IUpdateTaskCompletionService
{
	constructor(
		private readonly taskRepository: ITasksRepository,
		private readonly completeTaskService: ICompleteTaskService,
		private readonly uncompleteTaskService: IUncompleteTaskService,
	) {}

	async execute(
		input: UpdateTaskCompletionInputService,
	): Promise<UpdateTaskCompletionOutputService> {
		const task = await this.taskRepository.getByUserId(
			input.taskId,
			input.userId,
			input.projectId ?? null,
		);

		if (!task) {
			throw new TaskNotFound();
		}

		if (task.completed) {
			return this.uncompleteTaskService.execute({ task });
		}

		return this.completeTaskService.execute({ task });
	}
}
