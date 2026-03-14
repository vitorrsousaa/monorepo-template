import { makeGetTodosController } from "@factories/controllers/todo/get-todos";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetTodosController();
export const handler = lambdaHttpAdapter(controller);
