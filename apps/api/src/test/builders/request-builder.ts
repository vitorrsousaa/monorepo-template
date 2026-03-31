import type { Controller } from "@application/interfaces/controller";

type PrivateRequestOverrides<
	TBody extends Record<string, unknown> = Record<string, unknown>,
	TParams extends Record<string, unknown> = Record<string, unknown>,
> = Partial<Controller.Request<"private", TBody, TParams>>;

const defaults: Controller.Request<"private"> = {
	body: {},
	params: {},
	headers: {},
	queryParams: {},
	userId: "user-001",
};

export function buildPrivateRequest<
	TBody extends Record<string, unknown> = Record<string, unknown>,
	TParams extends Record<string, unknown> = Record<string, unknown>,
>(
	overrides?: PrivateRequestOverrides<TBody, TParams>,
): Controller.Request<"private", TBody, TParams> {
	return { ...defaults, ...overrides } as Controller.Request<
		"private",
		TBody,
		TParams
	>;
}
