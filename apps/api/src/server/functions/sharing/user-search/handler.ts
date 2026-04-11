import { makeUserSearchController } from "@factories/controllers/sharing/user-search";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeUserSearchController();
export const handler = lambdaHttpAdapter(controller);
