import { AppError } from "@application/errors/app-error";

export class MemberNotFoundError extends AppError {
	constructor() {
		super("Member not found", 404);
	}
}
