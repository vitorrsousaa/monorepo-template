import type { IConfig } from "@application/config/environment";

import jwt from "jsonwebtoken";
import type { ITokenProvider, PayloadProps } from "./types";

export class TokenProvider implements ITokenProvider {
	constructor(private readonly config: IConfig) {}

	generate(id: string) {
		const time = this.config.ACCESS_TOKEN_EXPIRATION;

		return jwt.sign({ id: id.toString() }, this.config.AUTH_SECRET, {
			expiresIn: time,
		});
	}

	async verify(token: string) {
		const result = jwt.verify(token, this.config.AUTH_SECRET);
		return result as PayloadProps;
	}
}
