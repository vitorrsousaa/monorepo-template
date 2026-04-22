import { AppError } from "@application/errors/app-error";

export class PendingInvitationError extends AppError {
	constructor() {
		super("A pending invitation already exists for this email", 409);
	}
}
