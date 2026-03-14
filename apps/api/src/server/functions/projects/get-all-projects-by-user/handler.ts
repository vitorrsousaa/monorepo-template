import { makeGetAllProjectsByUserController } from "@factories/controllers/projects/get-all-projects-by-user";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetAllProjectsByUserController();
export const handler = lambdaHttpAdapter(controller);
