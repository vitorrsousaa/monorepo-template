import type { IService } from "@application/interfaces/service";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { UncompleteTaskInput, UncompleteTaskOutput } from "./dto";

export interface IUncompleteTaskService
	extends IService<UncompleteTaskInput, UncompleteTaskOutput> {}

export class UncompleteTaskService implements IUncompleteTaskService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(input: UncompleteTaskInput): Promise<UncompleteTaskOutput> {
		const now = new Date().toISOString();
		const updatedTask = {
			...input.task,
			completed: false,
			completedAt: null,
			updatedAt: now,
		};
		const task = await this.taskRepository.updateCompletion(
			input.task,
			updatedTask,
		);
		return { task };
	}
}
