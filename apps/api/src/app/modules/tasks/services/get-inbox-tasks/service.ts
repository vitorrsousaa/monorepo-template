import type { IService } from "@application/interfaces/service";
import { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { GetInboxTasksInputService, GetInboxTasksOutputService } from "./dto";

export interface IGetInboxTasksService
	extends IService<GetInboxTasksInputService, GetInboxTasksOutputService> {}

export class GetInboxTasksService implements IGetInboxTasksService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(input: GetInboxTasksInputService): Promise<GetInboxTasksOutputService> {
		const tasks = await this.taskRepository.getInbox(input.userId);
		
		return { tasks, total: tasks.length };
	}
}
