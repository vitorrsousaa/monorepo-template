import type { IResponse } from "@application/interfaces/http";
import { APIGatewayProxyResultV2 } from "aws-lambda";

export function responseAdapter(response: IResponse):APIGatewayProxyResultV2 {
	return {
		statusCode: response.statusCode,
		body: JSON.stringify(response.body),
	};
}
