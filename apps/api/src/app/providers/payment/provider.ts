import type { IConfig } from "@application/config/environment";
import { AppError } from "@application/errors/app-error";
import type Stripe from "stripe";
import type {
	CreateCheckoutSessionInput,
	CreateCustomerInputs,
	CreateCustomerOutputs,
	IPaymentProvider,
} from "./types";

export class PaymentProvider implements IPaymentProvider {
	constructor(
		private readonly stripe: Stripe,
		private readonly config: IConfig,
	) {}

	constructEvent({
		body,
		signature,
	}: { body: string; signature: string }): Stripe.Event {
		const eventStripe = this.stripe.webhooks.constructEvent(
			body,
			signature,
			this.config.STRIPE_WEBHOOK_SECRET,
		);

		return eventStripe;
	}

	generateHeader(payload: string): string {
		const headerGenerated = this.stripe.webhooks.generateTestHeaderString({
			payload,
			secret: this.config.STRIPE_WEBHOOK_SECRET,
		});

		return headerGenerated;
	}

	async createCheckoutSession({
		userId,
		email,
		name,
	}: CreateCheckoutSessionInput): Promise<{ url: string }> {
		try {
			const customer = await this.createCustomer({
				email,
				name,
			});

			const successUrl = `${this.config.STRIPE_REDIRECT_URL}?success=true`;
			const cancelUrl = `${this.config.STRIPE_REDIRECT_URL}?canceled=true`;

			const session = await this.stripe.checkout.sessions.create({
				line_items: [
					{
						price: this.config.STRIPE_PRICE_ID,
						quantity: 1,
					},
				],
				mode: "payment",
				allow_promotion_codes: true,
				payment_method_types: ["card"],
				success_url: successUrl,
				cancel_url: cancelUrl,
				customer: customer.customer.id,
				metadata: {
					userId: userId,
					email: email,
				},
			});

			if (!session.url) {
				throw new AppError("Error to create session", 402);
			}

			return {
				url: session.url,
			};
		} catch (error) {
			console.log(error);
			throw new AppError("Error to create payment", 402);
		}
	}

	async createCustomer(
		inputs: CreateCustomerInputs,
	): Promise<CreateCustomerOutputs> {
		const freePlan = {
			priceId: this.config.STRIPE_FREE_PRICE_ID,
		};

		const customer = await this.getCustomerByEmail(inputs.email);

		if (customer) {
			const subscription = await this.getSubscriptionByCustomer(customer.id);

			return {
				customer,
				subscription,
				freePlan,
			};
		}

		const createdCustomer = await this.stripe.customers.create({
			email: inputs.email,
			name: inputs.name,
		});

		const createdCustomerSubscription = await this.stripe.subscriptions.create({
			customer: createdCustomer.id,
			items: [{ price: freePlan.priceId }],
		});

		const output = {
			customer: createdCustomer,
			subscription: createdCustomerSubscription,
			freePlan,
		};

		return output;
	}

	private async getCustomerByEmail(email: string): Promise<Stripe.Customer> {
		const customers = await this.stripe.customers.list({ email });

		return customers.data[0];
	}

	private async getSubscriptionByCustomer(
		customerId: string,
	): Promise<Stripe.Subscription> {
		const subscriptions = await this.stripe.subscriptions.list({
			customer: customerId,
			limit: 1,
		});

		return subscriptions.data[0];
	}
}
