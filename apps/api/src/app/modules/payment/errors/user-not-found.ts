import { AppError } from "@application/errors/app-error";

export class UserNotFound extends AppError {
	constructor() {
		super("User not found", 404);
	}
}
