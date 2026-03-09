import { GetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetDashboardAnalyticsService(): GetDashboardAnalyticsService {
	const todoRepository = makeTodoDynamoRepository();
	const projectRepository = makeProjectDynamoRepository();

	return new GetDashboardAnalyticsService();
}
