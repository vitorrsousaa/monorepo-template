import { makeGetAccountInfoController } from "@factories/controllers/auth/account-info";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetAccountInfoController();
export const handler = lambdaHttpAdapter(controller);
