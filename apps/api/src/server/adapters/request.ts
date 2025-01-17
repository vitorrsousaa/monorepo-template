import type { IRequest } from "@application/interfaces/http";
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyEventV2WithJWTAuthorizer,
} from "aws-lambda";
import { bodyParser } from "./bodyParser";

export function requestAdapter(
	event: APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer,
): IRequest {
	return {
		body: bodyParser(event.body ?? "{}"),
		headers: event.headers,
		params: event.pathParameters ?? {},
		queryParams: event.queryStringParameters ?? {},
	};
}
