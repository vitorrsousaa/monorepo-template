import type { IService } from "@application/interfaces/service";
import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ISectionRepository } from "@data/protocols/sections/section-repository";
import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
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
 * Orchestrates multiple repositories to compose the final DTO.
 *
 * Architecture note:
 * - Repositories return domain entities only
 * - Service composes the DTO by calling multiple repositories
 * - Uses Promise.all for parallel queries where possible
 */
export class GetProjectDetailService implements IGetProjectDetailService {
	constructor(
		private readonly projectRepository: IProjectRepository,
		private readonly sectionRepository: ISectionRepository,
		private readonly todoRepository: ITodoRepository,
	) {}

	async execute(input: GetProjectDetailInput): Promise<GetProjectDetailOutput> {
		const { projectId, userId } = input;

		// Query 1 & 2: Fetch project and sections in parallel (independent queries)
		const [project, sections] = await Promise.all([
			this.projectRepository.getById(projectId, userId),
			this.sectionRepository.getAllByProject(projectId, userId),
		]);

		if (!project) {
			throw new ProjectNotFound();
		}

		// Query 3-N: Fetch todos for each section in parallel
		const sectionsWithTodos: SectionWithTodos[] = await Promise.all(
			sections.map(async (section) => {
				const todos = await this.todoRepository.getAllBySection(
					section.id,
					projectId,
					userId,
				);

				return {
					...section,
					todos,
				};
			}),
		);

		return {
			data: {
				project,
				sections: sectionsWithTodos,
			},
		};
	}
}
