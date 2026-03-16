import { makeProfileController } from "@factories/controllers/auth/profile";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeProfileController();
export const handler = lambdaHttpAdapter(controller);
