import { makeUpdateMemberRoleController } from "@factories/controllers/sharing/update-member-role";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeUpdateMemberRoleController();
export const handler = lambdaHttpAdapter(controller);
