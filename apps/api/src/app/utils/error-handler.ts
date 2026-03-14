import type { IResponse } from "@application/interfaces/http";
import { AppError } from "../errors/app-error";
import { ServerError } from "../errors/server-error";
import { ZodError } from "../errors/zod";

export function errorHandler(error: unknown): IResponse {
	if (error instanceof ZodError) {
		return {
			statusCode: error.statusCode,
			body: error.details,
		};
	}

	if (error instanceof AppError) {
		return {
			statusCode: error.statusCode,
			body: {
				message: error.message,
			},
		};
	}

	console.log(error);

	return new ServerError().toResponse();
}
