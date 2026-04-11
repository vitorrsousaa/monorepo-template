import { makeGetMyInvitationsController } from "@factories/controllers/sharing/get-my-invitations";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetMyInvitationsController();
export const handler = lambdaHttpAdapter(controller);
