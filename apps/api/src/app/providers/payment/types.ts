import type Stripe from "stripe";

export interface CreateCustomerInputs {
	name: string;
	email: string;
}

export interface CreateCustomerOutputs {
	customer: Stripe.Customer;
	subscription: Stripe.Subscription;
	freePlan: {
		priceId: string;
	};
}

export interface CreateCheckoutSessionInput {
	userId: string;
	email: string;
	name: string;
}

export interface IPaymentProvider {
	createCustomer(inputs: CreateCustomerInputs): Promise<CreateCustomerOutputs>;
	createCheckoutSession(
		inputs: CreateCheckoutSessionInput,
	): Promise<{ url: string }>;
	generateHeader(header: string): string;
	constructEvent({
		body,
		signature,
	}: { body: string; signature: string }): Stripe.Event;
}
