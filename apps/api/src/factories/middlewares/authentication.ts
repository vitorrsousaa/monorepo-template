import { AuthenticationMiddleware } from "@application/shared/middlewares/authentication";
import { makeTokenProvider } from "@factories/providers/token";

export function makeAuthenticationMiddleware() {
	return new AuthenticationMiddleware(makeTokenProvider());
}
