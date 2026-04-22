import { AppError } from "@application/errors/app-error";

export class SelfInviteError extends AppError {
	constructor() {
		super("Cannot invite yourself", 400);
	}
}
