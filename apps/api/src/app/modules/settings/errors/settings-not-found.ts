import { AppError } from "@application/errors/app-error";

export class UserSettingsNotFound extends AppError {
	constructor(message = "User settings not found") {
		super(message, 404);
	}
}
