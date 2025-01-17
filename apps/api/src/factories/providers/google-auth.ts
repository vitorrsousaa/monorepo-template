import { GoogleAuthProvider } from "@application/providers/google";
import { makeConfigEnvironment } from "@factories/config/environment";

export function makeGoogleAuthProvider() {
	return new GoogleAuthProvider(makeConfigEnvironment());
}
