import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IAuthenticationMiddleware } from "@application/shared/middlewares/authentication";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import {
	type IProfileService,
	ProfileInputServiceSchema,
} from "../../services/profile";

export class ProfileController implements IController {
	constructor(
		private readonly service: IProfileService,
		private readonly authMiddleware: IAuthenticationMiddleware,
	) {}
	async handle(request: IRequest): Promise<IResponse> {
		try {
			const { userId } = await this.authMiddleware.handle(request);

			const [status, parsedBody] = missingFields(ProfileInputServiceSchema, {
				userId: userId,
			});

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
