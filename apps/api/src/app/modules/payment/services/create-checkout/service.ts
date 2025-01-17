import type { IUserRepository } from "@application/database/repositories/user";
import type { IService } from "@application/interfaces/service";
import type { IPaymentProvider } from "@application/providers/payment";
import * as z from "zod";
import { UserNotFound } from "../../errors/user-not-found";

export const CreateCheckoutInputServiceSchema = z.object({
	userId: z.string(),
});

export type TCreateCheckout = z.infer<typeof CreateCheckoutInputServiceSchema>;

export type ICreateCheckoutInput = TCreateCheckout;

export type ICreateCheckoutOutput = {
	url: string;
};

export type ICreateCheckoutService = IService<
	ICreateCheckoutInput,
	ICreateCheckoutOutput
>;

export class CreateCheckoutService implements ICreateCheckoutService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly paymentProvider: IPaymentProvider,
	) {}

	async execute(
		createCheckoutInput: ICreateCheckoutInput,
	): Promise<ICreateCheckoutOutput> {
		const user = await this.userRepository.getById(createCheckoutInput.userId);

		if (!user) {
			throw new UserNotFound();
		}

		const session = await this.paymentProvider.createCheckoutSession({
			name: user.name,
			userId: user.id,
			email: user.email,
		});

		return {
			url: session.url,
		};
	}
}
