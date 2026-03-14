import { makeGetInboxTodosController } from "@factories/controllers/todo/get-inbox-todos";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetInboxTodosController();
export const handler = lambdaHttpAdapter(controller);
