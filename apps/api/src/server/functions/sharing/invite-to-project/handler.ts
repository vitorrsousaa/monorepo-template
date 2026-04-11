import { makeInviteToProjectController } from "@factories/controllers/sharing/invite-to-project";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeInviteToProjectController();
export const handler = lambdaHttpAdapter(controller);
