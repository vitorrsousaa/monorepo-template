import type { IService } from "@application/interfaces/service";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { CompleteTaskInput, CompleteTaskOutput } from "./dto";

export interface ICompleteTaskService
	extends IService<CompleteTaskInput, CompleteTaskOutput> {}

export class CompleteTaskService implements ICompleteTaskService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(input: CompleteTaskInput): Promise<CompleteTaskOutput> {
		const now = new Date().toISOString();
		const updatedTask = {
			...input.task,
			completed: true,
			completedAt: now,
			updatedAt: now,
		};
		const task = await this.taskRepository.updateCompletion(
			input.task,
			updatedTask,
		);
		return { task };
	}
}
