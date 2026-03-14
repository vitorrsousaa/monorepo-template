import { Controller } from "@application/interfaces/controller";
import type { IGetProjectDetailService } from "@application/modules/projects/services/get-project-detail";

export class GetProjectDetailController extends Controller<"private"> {
	constructor(
		private readonly getProjectDetailService: IGetProjectDetailService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<undefined>> {
		const result = await this.getProjectDetailService.execute({
			userId: request.userId,
			projectId: (request.params.projectId as string) ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
