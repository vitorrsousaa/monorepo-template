import { makeGetTodayTasksController } from "@factories/controllers/tasks/get-today-tasks";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetTodayTasksController();
export const handler = lambdaHttpAdapter(controller);
