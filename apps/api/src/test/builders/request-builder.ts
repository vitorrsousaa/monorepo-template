import type { Controller } from "@application/interfaces/controller";

type PrivateRequestOverrides = Partial<Controller.Request<"private">>;

const defaults: Controller.Request<"private"> = {
	body: {},
	params: {},
	headers: {},
	queryParams: {},
	userId: "user-001",
};

export function buildPrivateRequest(
	overrides?: PrivateRequestOverrides,
): Controller.Request<"private"> {
	return { ...defaults, ...overrides };
}
