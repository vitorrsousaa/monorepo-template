import { Controller } from "@application/interfaces/controller";
import { IGetProjectsSummaryService } from "@application/modules/projects/services/get-projects-summary";
import { GetProjectsSummaryResponse } from "@repo/contracts/projects/summary";

export class GetProjectsSummaryController extends Controller<
	"private",
	GetProjectsSummaryResponse
> {
	constructor(
		private readonly getProjectsSummaryService: IGetProjectsSummaryService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private"
		>,
	): Promise<Controller.Response<GetProjectsSummaryResponse>> {
		const result = await this.getProjectsSummaryService.execute({
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
