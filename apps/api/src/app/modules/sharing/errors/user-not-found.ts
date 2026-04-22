import { AppError } from "@application/errors/app-error";

export class UserNotFoundError extends AppError {
	constructor() {
		super("User not found", 404);
	}
}
