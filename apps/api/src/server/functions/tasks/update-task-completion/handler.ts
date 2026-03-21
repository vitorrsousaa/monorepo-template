import { makeUpdateTaskCompletionController } from "@factories/controllers/tasks/update-task-completion";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeUpdateTaskCompletionController();
export const handler = lambdaHttpAdapter(controller);
