import { makeCreateSectionController } from "@factories/controllers/sections/create-section";
import { requestAdapter } from "@server/adapters/request";
import { responseAdapter } from "@server/adapters/response";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2) {
	const controller = makeCreateSectionController();

	const response = await controller.handle(requestAdapter(event));

	return responseAdapter(response);
}
