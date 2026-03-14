import { AppError } from "@application/errors/app-error";

export class UsernameExistsError extends AppError {
	constructor() {
		super("Username already exists", 409);
	}
}
