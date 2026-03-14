export interface IRequest<
	TBody extends Record<string, unknown> = Record<string, unknown>,
> {
	body: TBody;
	params: Record<string, unknown>;
	headers: Record<string, string | undefined>;
	queryParams: Record<string, string | undefined>;
	userId: string | null;
}

export interface IResponse {
	statusCode: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	body: Record<string, any> | null;
}
