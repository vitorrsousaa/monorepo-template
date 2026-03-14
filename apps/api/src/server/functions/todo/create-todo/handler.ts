import { makeCreateTodoController } from "@factories/controllers/todo/create-todo";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeCreateTodoController();
export const handler = lambdaHttpAdapter(controller);
