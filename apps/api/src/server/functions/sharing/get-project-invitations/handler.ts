import { makeGetProjectInvitationsController } from "@factories/controllers/sharing/get-project-invitations";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetProjectInvitationsController();
export const handler = lambdaHttpAdapter(controller);
