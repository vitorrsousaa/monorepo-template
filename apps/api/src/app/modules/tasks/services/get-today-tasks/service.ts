import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type {
	GetTodayTasksInput,
	GetTodayTasksOutput,
	TodayProjectOutput,
} from "./dto";

export interface IGetTodayTasksService
	extends IService<GetTodayTasksInput, GetTodayTasksOutput> {}

const INBOX_PROJECT_ID = "inbox";
const INBOX_PROJECT_NAME = "Inbox";

export class GetTodayTasksService implements IGetTodayTasksService {
	constructor(
		private readonly taskRepository: ITasksRepository,
		private readonly projectRepository: IProjectRepository,
	) {}

	async execute(data: GetTodayTasksInput): Promise<GetTodayTasksOutput> {
		const todos = await this.taskRepository.getTodayTasks(data.userId);

		// Group by projectId (null = Inbox)
		const byProject = new Map<string | null, typeof todos>();
		for (const todo of todos) {
			const key = todo.projectId ?? null;
			const list = byProject.get(key) ?? [];
			list.push(todo);
			byProject.set(key, list);
		}

		const projects: TodayProjectOutput[] = [];

		// Inbox first (domain: atrasadas no topo - Inbox is often overdue)
		const inboxTasks = byProject.get(null) ?? [];
		if (inboxTasks.length > 0) {
			projects.push({
				id: INBOX_PROJECT_ID,
				name: INBOX_PROJECT_NAME,
				tasks: inboxTasks,
			});
		}

		// Then projects with their names (sorted by name)
		const projectIds = [...byProject.keys()].filter((id) => id !== null);
		const projectEntries = await Promise.all(
			projectIds.map(async (projectId) => {
				const project = await this.projectRepository.getById(
					projectId ?? "",
					data.userId,
				);
				return {
					id: projectId ?? "",
					name: project?.name ?? "Unknown",
					tasks: byProject.get(projectId) ?? [],
				};
			}),
		);
		projectEntries.sort((a, b) => a.name.localeCompare(b.name));
		projects.push(...projectEntries);

		return { projects };
	}
}
