import { AppError } from "@application/errors/app-error";

export class InvalidPasswordError extends AppError {
	constructor() {
		super("Invalid Password", 400);
	}
}
