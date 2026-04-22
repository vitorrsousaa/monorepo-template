import { AppError } from "@application/errors/app-error";

export class AlreadyMemberError extends AppError {
	constructor() {
		super("User already has access to this project", 409);
	}
}
