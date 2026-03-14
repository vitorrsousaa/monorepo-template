import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IGetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";

export class GetDashboardAnalyticsController extends Controller {
	constructor(
		private readonly getDashboardAnalyticsService: IGetDashboardAnalyticsService,
	) {
		super();
	}

	protected override async handle(request: IRequest): Promise<IResponse> {
		const result = await this.getDashboardAnalyticsService.execute({
			userId: request.userId ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
