import type { IService } from "@application/interfaces/service";
import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { Task } from "@repo/contracts/tasks";
import type {
	GetProjectDetailInput,
	GetProjectDetailOutput,
	SectionWithTodos,
} from "./dto";

export interface IGetProjectDetailService
	extends IService<GetProjectDetailInput, GetProjectDetailOutput> {}

/**
 * GetProjectDetailService
 *
 * Service responsible for fetching project details including sections and todos.
 * Orchestrates 3 parallel queries (project + sections + all pending tasks)
 * and regroups tasks by sectionId in-memory.
 */
export class GetProjectDetailService implements IGetProjectDetailService {
	constructor(
		private readonly projectRepository: IProjectRepository,
		private readonly sectionRepository: ISectionRepository,
		private readonly taskRepository: ITasksRepository,
	) {}

	async execute(input: GetProjectDetailInput): Promise<GetProjectDetailOutput> {
		const { projectId, userId } = input;

		// 3 parallel queries
		const [project, sections, allPendingTasks] = await Promise.all([
			this.projectRepository.getById(projectId, userId),
			this.sectionRepository.getAllByProject(projectId, userId),
			this.taskRepository.getAllPendingByProject(projectId, userId),
		]);

		if (!project) {
			throw new ProjectNotFound();
		}

		// Group tasks by sectionId
		const tasksBySectionId = new Map<string, Task[]>();
		const tasksWithoutSection: Task[] = [];

		for (const task of allPendingTasks) {
			if (task.sectionId) {
				const existing = tasksBySectionId.get(task.sectionId) ?? [];
				existing.push(task);
				tasksBySectionId.set(task.sectionId, existing);
			} else {
				tasksWithoutSection.push(task);
			}
		}

		const sectionsWithTodos: SectionWithTodos[] = sections.map((section) => ({
			...section,
			todos: tasksBySectionId.get(section.id) ?? [],
		}));

		return {
			data: {
				project,
				sections: sectionsWithTodos,
				todosWithoutSection: tasksWithoutSection,
			},
		};
	}
}
