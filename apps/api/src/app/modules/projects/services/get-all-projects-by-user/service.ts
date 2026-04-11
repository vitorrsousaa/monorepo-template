import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";
import type {
	GetAllProjectsByUserInputService,
	GetAllProjectsByUserOutputService,
} from "./dto";

export interface IGetAllProjectsByUserService
	extends IService<
		GetAllProjectsByUserInputService,
		GetAllProjectsByUserOutputService
	> {}

export class GetAllProjectsByUserService
	implements IGetAllProjectsByUserService
{
	constructor(
		private readonly projectRepository: IProjectRepository,
		private readonly sharingRepository?: ISharingRepository,
	) {}

	async execute(
		data: GetAllProjectsByUserInputService,
	): Promise<GetAllProjectsByUserOutputService> {
		const ownProjects = await this.projectRepository.getAllProjectsByUser(
			data.userId,
		);

		const taggedOwnProjects = ownProjects.map((p) => ({
			...p,
			role: "owner" as const,
			isShared: false,
		}));

		if (!this.sharingRepository) {
			return { projects: taggedOwnProjects };
		}

		const boardAccessList =
			await this.sharingRepository.getAllBoardAccessByGuest(data.userId);

		const sharedProjects = await Promise.all(
			boardAccessList.map(async (ba) => {
				const project = await this.projectRepository.getById(
					ba.resourceId,
					ba.ownerUserId,
				);
				if (!project) return null;
				const members = project.members ?? [];
				return {
					...project,
					role: ba.role,
					isShared: true,
					memberCount: members.length,
				};
			}),
		);

		const validShared = sharedProjects.filter(
			(p): p is NonNullable<typeof p> => p !== null,
		);

		return { projects: [...taggedOwnProjects, ...validShared] };
	}
}
