import { WebhookService } from "@application/modules/payment/services/webhook";
import { makeUserRepository } from "@factories/repositories/user";

export function makeWebhookPaymentService() {
	return new WebhookService(makeUserRepository());
}
