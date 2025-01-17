import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IAuthenticationMiddleware } from "@application/shared/middlewares/authentication";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import {
	CreateCheckoutInputServiceSchema,
	type ICreateCheckoutService,
} from "../../services/create-checkout";

export class CreateCheckoutController implements IController {
	constructor(
		private readonly authenticationMiddleware: IAuthenticationMiddleware,
		private readonly service: ICreateCheckoutService,
	) {}
	async handle(request: IRequest): Promise<IResponse> {
		try {
			const { userId } = await this.authenticationMiddleware.handle(request);
			const [status, parsedBody] = missingFields(
				CreateCheckoutInputServiceSchema,
				{ ...request.body, userId },
			);

			if (!status) return parsedBody;

			const service = await this.service.execute(parsedBody);

			return {
				statusCode: 200,
				body: service,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
