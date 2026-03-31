import { GetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";

export function makeGetDashboardAnalyticsService(): GetDashboardAnalyticsService {
	const projectRepository = makeProjectDynamoRepository();

	return new GetDashboardAnalyticsService();
}
