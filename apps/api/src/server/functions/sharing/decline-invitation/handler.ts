import { makeDeclineInvitationController } from "@factories/controllers/sharing/decline-invitation";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeDeclineInvitationController();
export const handler = lambdaHttpAdapter(controller);
