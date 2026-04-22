import { AppError } from "@application/errors/app-error";

export class InvitationNotPendingError extends AppError {
	constructor() {
		super("Invitation is not pending", 409);
	}
}
