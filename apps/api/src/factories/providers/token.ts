import { TokenProvider } from "@application/providers/token";
import { makeConfigEnvironment } from "@factories/config/environment";

export function makeTokenProvider() {
	return new TokenProvider(makeConfigEnvironment());
}
