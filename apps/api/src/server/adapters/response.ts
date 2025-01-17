import type { IResponse } from "@application/interfaces/http";

export function responseAdapter(response: IResponse) {
	return {
		statusCode: response.statusCode,
		body: JSON.stringify(response.body),
	};
}
