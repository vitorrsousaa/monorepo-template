import type { IResponse } from "@application/interfaces/http";
import { AppError } from "../errors/app-error";
import { ServerError } from "../errors/server-error";

export function errorHandler(error: unknown): IResponse {
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
