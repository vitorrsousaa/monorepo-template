import type { IService } from "@application/interfaces/service";
import { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { CreateTasksInput, CreateTasksOutput } from "./dto";

export interface ICreateTasksService
	extends IService<CreateTasksInput, CreateTasksOutput> {}

export class CreateTasksService implements ICreateTasksService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(input: CreateTasksInput): Promise<CreateTasksOutput> {
		const task = await this.taskRepository.create({
			userId: input.userId,
			title: input.title,
			description: input.description ?? "",
			priority: input.priority ?? null,
			dueDate: input.dueDate ?? null,
			projectId: input.projectId ?? null,
			sectionId: input.sectionId ?? null,
		});
		return { task };
	}
}
