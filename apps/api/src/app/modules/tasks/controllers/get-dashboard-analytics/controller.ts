import { Controller } from "@application/interfaces/controller";
import type { IGetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";

export class GetDashboardAnalyticsController extends Controller<"private"> {
	constructor(
		private readonly getDashboardAnalyticsService: IGetDashboardAnalyticsService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<undefined>> {
		const result = await this.getDashboardAnalyticsService.execute({
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
