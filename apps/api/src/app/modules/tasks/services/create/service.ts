import type { IService } from "@application/interfaces/service";
import { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { CreateTasksInput, CreateTasksOutput } from "./dto";

export interface ICreateTasksService
	extends IService<CreateTasksInput, CreateTasksOutput> {}

export class CreateTasksService implements ICreateTasksService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(input: CreateTasksInput): Promise<CreateTasksOutput> {
		const { userId } = input;

		const task = await this.taskRepository.create({
			userId,
			title: "Task de teste",
			description: "Descrição da task de teste",
			priority: "medium",
			dueDate: null,
			projectId: null,
			sectionId: null,
		});
		return { task };
	}
}
