import { AppError } from "@application/errors/app-error";

export class MemberLimitExceededError extends AppError {
	constructor() {
		super("Project member limit exceeded", 422);
	}
}
