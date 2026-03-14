import { makeSigninController } from "@factories/controllers/auth/signin";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeSigninController();
export const handler = lambdaHttpAdapter(controller);
