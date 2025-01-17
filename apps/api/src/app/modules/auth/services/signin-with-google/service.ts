import type { IUserRepository } from "@application/database/repositories/user";
import type { IService } from "@application/interfaces/service";
import type { IGoogleAuthProvider } from "@application/providers/google";
import type { IPaymentProvider } from "@application/providers/payment";
import type { ITokenProvider } from "@application/providers/token";
import * as z from "zod";
import { EmailNotVerified } from "../../errors/email-not-verified";

export const SigninWithGoogleInputServiceSchema = z.object({
	code: z.string(),
});

export type TSigninWithGoogle = z.infer<
	typeof SigninWithGoogleInputServiceSchema
>;

export type ISigninWithGoogleInput = TSigninWithGoogle;

export type ISigninWithGoogleOutput = {
	token: string;
};

export type ISigninWithGoogleService = IService<
	ISigninWithGoogleInput,
	ISigninWithGoogleOutput
>;

export class SigninWithGoogleService implements ISigninWithGoogleService {
	constructor(
		private readonly googleProvider: IGoogleAuthProvider,
		private readonly userRepository: IUserRepository,
		private readonly tokenProvider: ITokenProvider,
		private readonly paymentProvider: IPaymentProvider,
	) {}

	async execute(
		signinWithGoogleInput: ISigninWithGoogleInput,
	): Promise<ISigninWithGoogleOutput> {
		const accessToken = await this.googleProvider.getAccessToken(
			signinWithGoogleInput.code,
		);

		const googleUser = await this.googleProvider.getUserInfo(accessToken);

		if (!googleUser.verified_email) {
			throw new EmailNotVerified();
		}

		const userExists = await this.userRepository.getById(googleUser.id);

		if (userExists) {
			const token = this.tokenProvider.generate(userExists.id);

			return {
				token,
			};
		}

		const { customer, subscription, freePlan } =
			await this.paymentProvider.createCustomer({
				name: googleUser.name,
				email: googleUser.email,
			});

		const user = await this.userRepository.create({
			email: googleUser.email,
			name: googleUser.name,
			id: googleUser.id,
			picture: googleUser.picture,
			customerId: customer.id,
			subscriptionId: subscription.id,
			subscriptionStatus: subscription.status,
			priceId: freePlan.priceId,
		});

		const jwtAccessToken = this.tokenProvider.generate(user.id);

		return {
			token: jwtAccessToken,
		};
	}
}
