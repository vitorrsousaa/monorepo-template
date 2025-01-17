import type { IConfig } from "@application/config/environment";
import StripeLib from "stripe";

// export const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
// 	apiVersion: "2024-06-20",
// 	httpClient: Stripe.createFetchHttpClient(),
// });

export class Stripe {
	constructor(private readonly config: IConfig) {}

	get() {
		return new StripeLib(this.config.STRIPE_SECRET_KEY, {
			apiVersion: "2024-06-20",
			httpClient: StripeLib.createFetchHttpClient(),
		});
	}
}
