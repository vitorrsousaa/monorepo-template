import { AppError } from "@application/errors/app-error";

export class TaskNotFound extends AppError {
	constructor() {
		super("Task not found", 404);
	}
}
