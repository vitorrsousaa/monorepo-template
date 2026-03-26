import { makeGetByUserSettingsController } from "@factories/controllers/settings/get-by-user-settings";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeGetByUserSettingsController();
export const handler = lambdaHttpAdapter(controller);
