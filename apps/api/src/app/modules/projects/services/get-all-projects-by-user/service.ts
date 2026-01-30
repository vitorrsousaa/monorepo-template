import type { IService } from "@application/interfaces/service";
import type { ProjectRepository } from "@data/protocols/projects/project-repository";
import type {
  GetAllProjectsByUserInput,
  GetAllProjectsByUserOutput,
} from "./dto";

export interface IGetAllProjectsByUserService
  extends IService<GetAllProjectsByUserInput, GetAllProjectsByUserOutput> {}

export class GetAllProjectsByUserService
  implements IGetAllProjectsByUserService
{
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    data: GetAllProjectsByUserInput
  ): Promise<GetAllProjectsByUserOutput> {
    const projects = await this.projectRepository.getAllProjectsByUser(
      data.userId
    );

    return {
      projects,
    };
  }
}
