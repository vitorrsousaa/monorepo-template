import { makeCancelInvitationController } from "@factories/controllers/sharing/cancel-invitation";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeCancelInvitationController();
export const handler = lambdaHttpAdapter(controller);
