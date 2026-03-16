import { makeCreateTasksController } from "@factories/controllers/tasks/create-tasks";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeCreateTasksController();
export const handler = lambdaHttpAdapter(controller);
