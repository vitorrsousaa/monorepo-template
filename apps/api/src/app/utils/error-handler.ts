import type { IResponse } from "@application/interfaces/http";
import { createLogger } from "@application/utils/logger";
import { AppError } from "../errors/app-error";
import { ServerError } from "../errors/server-error";
import { ZodError } from "../errors/zod";

const logger = createLogger("error-handler");

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

	logger.error(error);

	return new ServerError().toResponse();
}
