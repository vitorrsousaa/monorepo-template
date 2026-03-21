import { makeGetProjectDetailController } from "@factories/controllers/projects/get-projects-summary";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetProjectDetailController();
export const handler = lambdaHttpAdapter(controller);
