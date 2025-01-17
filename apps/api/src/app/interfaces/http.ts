export interface IRequest {
	body: Record<string, unknown>;
	params: Record<string, unknown>;
	headers: Record<string, string | undefined>;
	queryParams: Record<string, string | undefined>;
}

export interface IResponse {
	statusCode: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	body: Record<string, any> | null;
}
