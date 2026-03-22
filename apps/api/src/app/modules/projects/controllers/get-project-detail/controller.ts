import { Controller } from "@application/interfaces/controller";
import type { IProjectParams } from "@application/interfaces/params";
import type { IGetProjectDetailService } from "@application/modules/projects/services/get-project-detail";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";

type ControllerRequestBody = Record<string, unknown>;

export class GetProjectDetailController extends Controller<
	"private",
	GetProjectDetailResponse,
	ControllerRequestBody,
	IProjectParams
> {
	constructor(
		private readonly getProjectDetailService: IGetProjectDetailService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			ControllerRequestBody,
			IProjectParams
		>,
	): Promise<Controller.Response<GetProjectDetailResponse>> {
		const result = await this.getProjectDetailService.execute({
			userId: request.userId,
			projectId: request.params.projectId,
		});
		return {
			statusCode: 200,
			body: result.data,
		};
	}
}
