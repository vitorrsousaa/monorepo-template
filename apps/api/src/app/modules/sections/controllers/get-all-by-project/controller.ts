import { Controller } from "@application/interfaces/controller";
import { IProjectParams } from "@application/interfaces/params";
import type { IGetAllByProjectService } from "@application/modules/sections/services/get-all-by-project";
import type { GetAllSectionsResponse } from "@repo/contracts/sections/get-all";

type ControllerRequestBody = Record<string, unknown>;

export class GetAllByProjectController extends Controller<
	"private",
	GetAllSectionsResponse,
	ControllerRequestBody,
	IProjectParams
> {
	constructor(
		private readonly getAllByProjectService: IGetAllByProjectService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			ControllerRequestBody,
			IProjectParams
		>,
	): Promise<Controller.Response<GetAllSectionsResponse>> {
		const result = await this.getAllByProjectService.execute({
			userId: request.userId,
			projectId: request.params.projectId,
		});
		return {
			statusCode: 200,
			body: {
				sections: result.sections,
				total: result.total,
			},
		};
	}
}
