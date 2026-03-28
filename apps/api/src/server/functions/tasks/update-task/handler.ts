import { makeUpdateTaskController } from "@factories/controllers/tasks/update-task";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeUpdateTaskController();
export const handler = lambdaHttpAdapter(controller);
