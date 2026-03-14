import { makeCreateProjectController } from "@factories/controllers/projects/create";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeCreateProjectController();
export const handler = lambdaHttpAdapter(controller);
