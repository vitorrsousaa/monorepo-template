import { makeRemoveMemberController } from "@factories/controllers/sharing/remove-member";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeRemoveMemberController();
export const handler = lambdaHttpAdapter(controller);
