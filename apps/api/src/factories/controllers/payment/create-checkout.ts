import { CreateCheckoutController } from "@application/modules/payment/controllers/create-checkout";
import { makeAuthenticationMiddleware } from "@factories/middlewares/authentication";
import { makeCreateCheckoutService } from "@factories/services/payment/create-checkout";

export function makeCreateCheckoutController() {
	return new CreateCheckoutController(
		makeAuthenticationMiddleware(),
		makeCreateCheckoutService(),
	);
}
