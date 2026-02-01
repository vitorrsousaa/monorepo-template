import type { IService } from "@application/interfaces/service";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { GetProjectDetailInput, GetProjectDetailOutput } from "./dto";

export interface IGetProjectDetailService
  extends IService<GetProjectDetailInput, GetProjectDetailOutput> {}

export class GetProjectDetailService implements IGetProjectDetailService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(data: GetProjectDetailInput): Promise<GetProjectDetailOutput> {
    return {
      success: true,
    };
  }
}
