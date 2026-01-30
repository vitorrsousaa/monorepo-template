import { MOCK_USER_ID } from "@application/config/mock-user";
import type { IRequest } from "@application/interfaces/http";
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyEventV2WithJWTAuthorizer,
} from "aws-lambda";
import { bodyParser } from "./body-parser";

export function requestAdapter(
	event: APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer,
): IRequest {
	const jwtSub = (event as APIGatewayProxyEventV2WithJWTAuthorizer)
		.requestContext?.authorizer?.jwt?.claims?.sub as string | undefined;

	return {
		body: bodyParser(event.body ?? "{}"),
		headers: event.headers,
		params: event.pathParameters ?? {},
		queryParams: event.queryStringParameters ?? {},
		userId: jwtSub ?? MOCK_USER_ID,
	};
}
