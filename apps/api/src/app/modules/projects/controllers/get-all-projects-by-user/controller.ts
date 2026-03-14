import { Controller } from "@application/interfaces/controller";
import { projectToDto } from "@application/modules/projects/mappers/project-to-dto";
import type { IGetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
import type { GetAllProjectsByUserResponse } from "@repo/contracts/projects";

export class GetAllProjectsByUserController extends Controller<'private',GetAllProjectsByUserResponse> {
	constructor(
		private readonly getAllProjectsByUserService: IGetAllProjectsByUserService,
	) {
		super();
	}

	protected override async handle(request: Controller.Request<'private'>): Promise<Controller.Response<GetAllProjectsByUserResponse>> {
		const result = await this.getAllProjectsByUserService.execute({
			userId: request.userId,
		});
		const body: GetAllProjectsByUserResponse = {
			projects: result.projects.map(projectToDto),
		};
		return {
			statusCode: 200,
			body,
		};
	}
}
