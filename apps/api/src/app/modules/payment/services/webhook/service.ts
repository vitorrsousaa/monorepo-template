import type { IUserRepository } from "@application/database/repositories/user";
import type { IService } from "@application/interfaces/service";
import type Stripe from "stripe";

export type IWebhookInput = Stripe.Event;

export type IWebhookOutput = {
	message: string;
};

export type IWebhookService = IService<IWebhookInput, IWebhookOutput>;

export class WebhookService implements IWebhookService {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(webhookInput: IWebhookInput): Promise<IWebhookOutput> {
		switch (webhookInput.type) {
			case "checkout.session.completed":
				console.log("checkout.session.completed");
				if (webhookInput.data.object.payment_status === "paid") {
					// pagamento por cartão com sucesso
					const metadata = webhookInput.data.object.metadata;
					const userId = metadata ? metadata.userId : null;

					if (userId) {
						// TODO: mandar email de confirmação de pagamento
						const isPremium = true;
						const originalUser = await this.userRepository.getById(userId);

						if (originalUser) {
							// atualiza o usuário para premium
							// await this.userRepository.update({ ...originalUser, isPremium });
						}
					}
				}

				if (
					webhookInput.data.object.payment_status === "unpaid" &&
					webhookInput.data.object.payment_intent
				) {
					// pagamento por boleto
					// const paymentIntent = await stripe.paymentIntents.retrieve(
					// 	webhookInput.data.object.payment_intent.toString(),
					// );
					// const hostedVoucherUrl =
					// 	paymentIntent.next_action?.boleto_display_details
					// 		?.hosted_voucher_url;
					// if (hostedVoucherUrl) {
					// 	//o cliente gerou um boleto, manda um email pra ele
					// 	const userEmail = webhookInput.data.object.customer_details?.email;
					// }
				}

				// code here
				break;
			case "checkout.session.expired":
				if (webhookInput.data.object.payment_status === "unpaid") {
					// o cliente saiu do checkout e expirou
				}
				break;
			case "checkout.session.async_payment_succeeded":
				// code here
				if (webhookInput.data.object.payment_status === "paid") {
					// o cliente pagou o boleto e o pagametno foi confirmado
				}
				break;
			case "checkout.session.async_payment_failed":
				if (webhookInput.data.object.payment_status === "unpaid") {
					//o cliente não pagou o boleto e ele venceu
				}

				break;
			default:
				console.log(`Unhandled event type ${webhookInput.type}`);
		}

		return {
			message: "Webhook received",
		};
	}
}
