import { AppError } from "@application/errors/app-error";

export class EmailNotVerified extends AppError {
	constructor() {
		super("Email not verified", 403);
	}
}
