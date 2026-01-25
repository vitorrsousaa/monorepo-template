import type { AxiosError } from "axios";

export class AppError {
	public readonly message: string;
	public readonly statusCode: number;

	constructor(httpError: AxiosError) {
		this.message =
			(httpError.response?.data as Record<string, string>)?.message ||
			httpError.message ||
			"Internal Server Error";
		this.statusCode = httpError.response?.status || 500;
	}
}
