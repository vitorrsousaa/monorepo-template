import { AppError } from "@application/errors/app-error";

export class InvalidParameterError extends AppError {
	constructor(message = "Invalid Parameter") {
		super(message, 400);
	}
}
