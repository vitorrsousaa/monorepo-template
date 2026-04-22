import { AppError } from "@application/errors/app-error";

export class InvitationExpiredError extends AppError {
	constructor() {
		super("Invitation has expired", 410);
	}
}
