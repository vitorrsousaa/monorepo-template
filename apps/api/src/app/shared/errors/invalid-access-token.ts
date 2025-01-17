import { AppError } from "@application/errors/app-error";

export class InvalidAccessToken extends AppError {
	constructor() {
		super("Invalid access token", 401);
	}
}
