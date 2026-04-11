import { makeGetProjectMembersController } from "@factories/controllers/sharing/get-project-members";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetProjectMembersController();
export const handler = lambdaHttpAdapter(controller);
