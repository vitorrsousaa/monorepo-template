import { makeGetInboxTasksController } from "@factories/controllers/tasks/get-inbox-tasks";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetInboxTasksController();
export const handler = lambdaHttpAdapter(controller);
