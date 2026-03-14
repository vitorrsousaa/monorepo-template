import type { ZodError as LibZodError } from "zod";
import { AppError } from "./app-error";

export class ZodError extends AppError {
	public readonly details: { field: string | number; message: string }[];

	constructor(error: LibZodError) {
		super("Validation failed", 422);
		const issues = error?.issues ?? [];
		this.details = issues.map((issue) => ({
			field: issue.path.map((path) => path.toString()).join("-"),
			message: issue.message,
		}));
	}
}
