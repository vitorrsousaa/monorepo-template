import { AppError } from "@application/errors/app-error";

export class UserNotConfirmedError extends AppError {
	constructor(
		message = "You need to confirm your account before sign in."
	) {
		super(message, 401);
	}
}
