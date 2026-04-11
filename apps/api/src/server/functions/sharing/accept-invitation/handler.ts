import { makeAcceptInvitationController } from "@factories/controllers/sharing/accept-invitation";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeAcceptInvitationController();
export const handler = lambdaHttpAdapter(controller);
