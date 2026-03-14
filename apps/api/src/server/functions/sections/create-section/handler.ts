import { makeCreateSectionController } from "@factories/controllers/sections/create-section";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeCreateSectionController();
export const handler = lambdaHttpAdapter(controller);
