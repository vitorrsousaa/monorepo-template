import { errorHandler } from "@application/utils/error-handler";
import { makePaymentProvider } from "@factories/providers/payment";
import { makeWebhookPaymentService } from "@factories/services/payment/webhook";
import { responseAdapter } from "@server/adapters/response";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2) {
	const signature = event.headers["stripe-signature"] as string;

	const paymentProvider = makePaymentProvider();

	try {
		const eventStripe = paymentProvider.constructEvent({
			body: event.body || "",
			signature,
		});

		const service = makeWebhookPaymentService();

		await service.execute(eventStripe);

		const response = {
			statusCode: 200,
			body: { message: "Webhook received" },
		};

		return responseAdapter(response);
	} catch (error) {
		const output = errorHandler(error);

		return responseAdapter(output);
	}
}
