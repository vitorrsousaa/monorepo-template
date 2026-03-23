import { GetAccountInfoController } from "@application/modules/auth/controllers/account-info";
import { makeGetAccountInfoService } from "@factories/services/auth/account-info";

export function makeGetAccountInfoController(): GetAccountInfoController {
	const getAccountInfoService = makeGetAccountInfoService();
	return new GetAccountInfoController(getAccountInfoService);
}
