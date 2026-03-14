import type { IController } from "@application/interfaces/controller";
import { requestAdapter } from "@server/adapters/request";
import { responseAdapter } from "@server/adapters/response";
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyEventV2WithJWTAuthorizer,
} from "aws-lambda";

type LambdaEvent =
	| APIGatewayProxyEventV2
	| APIGatewayProxyEventV2WithJWTAuthorizer;

export function lambdaHttpAdapter(
	controller: IController,
): (event: LambdaEvent) => Promise<ReturnType<typeof responseAdapter>> {
	return async (event: LambdaEvent) => {
		const request = requestAdapter(event);
		const response = await controller.handle(request);
		return responseAdapter(response);
	};
}
