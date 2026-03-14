import { makeGetDashboardAnalyticsController } from "@factories/controllers/tasks/get-dashboard-analytics";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetDashboardAnalyticsController();
export const handler = lambdaHttpAdapter(controller);
