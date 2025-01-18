import type { IRequest } from "@application/interfaces/http";
import type { IMiddleware } from "@application/interfaces/middleware";
import type { ITokenProvider } from "@application/providers/token";
import { InvalidAccessToken } from "@application/shared/errors/invalid-access-token";

export interface IAuthenticationMiddleware extends IMiddleware {}

export class AuthenticationMiddleware implements IAuthenticationMiddleware {
	constructor(private readonly tokenProvider: ITokenProvider) {}

	async handle(request: IRequest): Promise<Record<string, string>> {
		const { authorization } = request.headers;

		if (!authorization) {
			throw new InvalidAccessToken();
		}

		try {
			const [bearer, token] = authorization.split(" ");

			if (bearer !== "Bearer") {
				throw new InvalidAccessToken();
			}

			const payload = await this.tokenProvider.verify(token);

			return {
				userId: payload.id,
			};
		} catch {
			throw new InvalidAccessToken();
		}
	}
}
