import type { IService } from "@application/interfaces/service";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { CreateTasksInputService, CreateTasksOutputService } from "./dto";

export interface ICreateTasksService
	extends IService<CreateTasksInputService, CreateTasksOutputService> {}

export class CreateTasksService implements ICreateTasksService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(
		input: CreateTasksInputService,
	): Promise<CreateTasksOutputService> {
		const task = await this.taskRepository.create({
			userId: input.userId,
			title: input.title,
			description: input.description ?? null,
			priority: input.priority ?? null,
			dueDate: input.dueDate ?? null,
			projectId: input.projectId ?? null,
			sectionId: input.sectionId ?? null,
		});
		return { task };
	}
}
