import { Stripe } from "@application/libs/stripe";
import { makeConfigEnvironment } from "@factories/config/environment";

export function makeStripeClient() {
	return new Stripe(makeConfigEnvironment()).get();
}
