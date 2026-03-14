import type {
	Controller as ControllerBase,
	TControllerType,
} from "@application/interfaces/controller";
import { errorHandler } from "@application/utils/error-handler";
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
	controller: ControllerBase<TControllerType, unknown>,
): (event: LambdaEvent) => Promise<ReturnType<typeof responseAdapter>> {
	return async (event: LambdaEvent) => {
		const request = requestAdapter(event);
		try {
			const response = await controller.execute(request);
			return responseAdapter(response);
		} catch (error) {
			return responseAdapter(errorHandler(error));
		}
	};
}
