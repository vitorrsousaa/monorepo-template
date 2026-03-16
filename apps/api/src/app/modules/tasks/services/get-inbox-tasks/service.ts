import type { IService } from "@application/interfaces/service";
import { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks";
import type {
	GetInboxTasksInputService,
	GetInboxTasksOutputService,
} from "./dto";

export interface IGetInboxTasksService
	extends IService<GetInboxTasksInputService, GetInboxTasksOutputService> {}

export class GetInboxTasksService implements IGetInboxTasksService {
	constructor(private readonly taskRepository: ITasksRepository) {}

	async execute(
		input: GetInboxTasksInputService,
	): Promise<GetInboxTasksOutputService> {
		const tasks = await this.taskRepository.getInbox(input.userId);
		const sortedTasks = this.sortByPriorityAndDueDate(tasks);

		return { tasks: sortedTasks, total: sortedTasks.length };
	}

	private sortByPriorityAndDueDate(tasks: Task[]): Task[] {
		const priorityValue = (p: string | null | undefined): number => {
			const map = { high: 3, medium: 2, low: 1 };
			return map[p as keyof typeof map] ?? 0;
		};

		return [...tasks].sort((a, b) => {
			const priorDiff = priorityValue(b.priority) - priorityValue(a.priority);
			if (priorDiff !== 0) return priorDiff;

			const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
			const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

			return aTime - bTime;
		});
	}
}
