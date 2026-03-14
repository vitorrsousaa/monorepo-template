import { makeSignupController } from "@factories/controllers/auth/signup";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeSignupController();
export const handler = lambdaHttpAdapter(controller);
