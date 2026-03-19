import type { IService } from "@application/interfaces/service";
import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import {
	PROJECTS_DEFAULT_IDS,
	SECTION_DEFAULT_NAMES,
} from "@repo/contracts/enums";
import { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import type { SectionsWithTasks } from "@repo/contracts/sections/entities";
import type { Task } from "@repo/contracts/tasks";
import type {
	GetProjectDetailInputService,
	GetProjectDetailOutputService,
} from "./dto";

export interface IGetProjectDetailService
	extends IService<
		GetProjectDetailInputService,
		GetProjectDetailOutputService
	> {}

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

	async execute(
		input: GetProjectDetailInputService,
	): Promise<GetProjectDetailOutputService> {
		const { projectId, userId } = input;

		const [project, sections, allPendingTasks] = await Promise.all([
			this.projectRepository.getById(projectId, userId),
			this.sectionRepository.getAllByProject(projectId, userId),
			this.taskRepository.getAllPendingByProject(projectId, userId),
		]);

		if (!project) {
			throw new ProjectNotFound();
		}

		const nowIso = new Date().toISOString();

		// Group tasks by sectionId
		const tasksBySectionId = new Map<string, Task[]>();
		const tasksWithoutSection: Task[] = [];

		for (const task of allPendingTasks) {
			if (!task.sectionId) {
				tasksWithoutSection.push(task);
				continue;
			}

			if (!tasksBySectionId.has(task.sectionId)) {
				tasksBySectionId.set(task.sectionId, []);
			}

			tasksBySectionId.get(task.sectionId)!.push(task);
		}

		const sectionsWithTasks = sections.map((section) => ({
			...section,
			tasks: tasksBySectionId.get(section.id) ?? [],
		}));

		const inboxSectionWithTasks: SectionsWithTasks = {
			id: PROJECTS_DEFAULT_IDS.INBOX,
			name: SECTION_DEFAULT_NAMES.UNSECTIONED,
			projectId,
			userId,
			order: 0,
			createdAt: nowIso,
			updatedAt: nowIso,
			tasks: tasksWithoutSection,
		};

		const data: GetProjectDetailResponse = {
			project,
			sections: [inboxSectionWithTasks, ...sectionsWithTasks],
		};

		return { data };
	}
}
