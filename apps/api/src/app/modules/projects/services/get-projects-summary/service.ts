import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { ProjectSummary } from "@repo/contracts/projects/summary";
import type {
	GetProjectsSummaryInputService,
	GetProjectsSummaryOutputService,
} from "./dto";

export interface IGetProjectsSummaryService
	extends IService<
		GetProjectsSummaryInputService,
		GetProjectsSummaryOutputService
	> {}

/**
 * GetProjectDetailService
 *
 * Service responsible for fetching project details including sections and todos.
 * Orchestrates 3 parallel queries (project + sections + all pending tasks)
 * and regroups tasks by sectionId in-memory.
 */
export class GetProjectsSummaryService implements IGetProjectsSummaryService {
	constructor(
		private readonly projectRepository: IProjectRepository,
		private readonly taskRepository: ITasksRepository,
	) {}

	async execute(
		input: GetProjectsSummaryInputService,
	): Promise<GetProjectsSummaryOutputService> {
		const { userId } = input;

		const projects = await this.projectRepository.getAllProjectsByUser(userId);

		const taskCounts = await Promise.all(
			projects.map((p) =>
				this.taskRepository.getTaskCountsByProject(p.id, userId),
			),
		);

		const projectsSummaries: ProjectSummary[] = projects.map((p, index) => {
			const taskCount = taskCounts[index] ?? { pending: 0, completed: 0 };

			const percentageCompleted =
				taskCount.completed / (taskCount.pending + taskCount.completed);

			return {
				...p,
				completedCount: taskCount.completed,
				totalCount: taskCount.pending + taskCount.completed,
				percentageCompleted: percentageCompleted ?? 0,
			};
		});

		const data: GetProjectsSummaryOutputService = {
			projects: projectsSummaries,
		};

		return data;
	}
}
