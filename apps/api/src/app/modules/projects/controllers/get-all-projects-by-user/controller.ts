import { Controller } from "@application/interfaces/controller";
import type { IGetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
import type { GetAllProjectsByUserResponse } from "@repo/contracts/projects/get-all";

export class GetAllProjectsByUserController extends Controller<
	"private",
	GetAllProjectsByUserResponse
> {
	constructor(
		private readonly getAllProjectsByUserService: IGetAllProjectsByUserService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<GetAllProjectsByUserResponse>> {
		const result = await this.getAllProjectsByUserService.execute({
			userId: request.userId,
		});
		const body = result;
		return {
			statusCode: 200,
			body,
		};
	}
}
