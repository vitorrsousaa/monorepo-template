import { AppError } from "@application/errors/app-error";

export class ProjectNotFound extends AppError {
	constructor() {
		super("Project not found", 404);
	}
}
