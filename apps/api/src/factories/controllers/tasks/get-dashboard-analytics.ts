
import { GetDashboardAnalyticsController } from "@application/modules/tasks/controllers/get-dashboard-analytics";
import { makeGetDashboardAnalyticsService } from "@factories/services/tasks/get-dashboard-analytics";

export function makeGetDashboardAnalyticsController(): GetDashboardAnalyticsController {
	const getDashboardAnalyticsService = makeGetDashboardAnalyticsService();

	return new GetDashboardAnalyticsController(getDashboardAnalyticsService);
}
