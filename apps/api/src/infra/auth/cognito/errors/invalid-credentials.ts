import { AppError } from "@application/errors/app-error";

export class InvalidCredentialsError extends AppError {
	constructor(message = "Invalid Credentials") {
		super(message, 401);
	}
}
