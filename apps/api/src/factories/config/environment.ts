import { Config } from "@application/config/environment";

export function makeConfigEnvironment() {
	return new Config();
}
