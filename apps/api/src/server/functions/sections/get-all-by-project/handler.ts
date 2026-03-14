import { makeGetAllByProjectController } from "@factories/controllers/sections/get-all-by-project";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetAllByProjectController();
export const handler = lambdaHttpAdapter(controller);
