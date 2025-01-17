import { CreateCheckoutService } from "@application/modules/payment/services/create-checkout";
import { makePaymentProvider } from "@factories/providers/payment";
import { makeUserRepository } from "@factories/repositories/user";

export function makeCreateCheckoutService() {
	return new CreateCheckoutService(makeUserRepository(), makePaymentProvider());
}
