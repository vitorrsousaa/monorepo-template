import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { IGetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";
import { getDashboardAnalyticsSchema } from "./schema";

export class GetDashboardAnalyticsController implements IController {
	constructor(private readonly getDashboardAnalyticsService: IGetDashboardAnalyticsService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getDashboardAnalyticsSchema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.getDashboardAnalyticsService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
