import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IGetProjectDetailService } from "@application/modules/projects/services/get-project-detail";

export class GetProjectDetailController extends Controller {
	constructor(
		private readonly getProjectDetailService: IGetProjectDetailService,
	) {
		super();
	}

	protected override async handle(request: IRequest): Promise<IResponse> {
		const result = await this.getProjectDetailService.execute({
			userId: request.userId ?? "",
			projectId: (request.params.projectId as string) ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
