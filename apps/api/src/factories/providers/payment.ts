import { PaymentProvider } from "@application/providers/payment";
import { makeConfigEnvironment } from "@factories/config/environment";
import { makeStripeClient } from "@factories/libs/stripe";

export function makePaymentProvider() {
	return new PaymentProvider(makeStripeClient(), makeConfigEnvironment());
}
