import { AppError } from "@application/errors/app-error";

export class InvitationNotFoundError extends AppError {
	constructor() {
		super("Invitation not found", 404);
	}
}
