import { GetUserSettingsController } from "@application/modules/settings/controllers/get-user-settings";
import { makeGetUserSettingsService } from "@factories/services/settings/get-user-settings";

export function makeGetByUserSettingsController(): GetUserSettingsController {
  const getUserSettingsService = makeGetUserSettingsService();

  return new GetUserSettingsController(getUserSettingsService);
}
