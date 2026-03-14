import type { APIGatewayProxyResultV2 } from "aws-lambda";

/** Accepts both IResponse and Controller.Response (body can be unknown). */
export function responseAdapter(response: {
	statusCode: number;
	body?: unknown;
}): APIGatewayProxyResultV2 {
	return {
		statusCode: response.statusCode,
		body: JSON.stringify(response.body),
	};
}
