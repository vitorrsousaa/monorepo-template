import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import {
	type ISigninWithGoogleService,
	SigninWithGoogleInputServiceSchema,
} from "../../services/signin-with-google";

export class SigninWithGoogleController implements IController {
	constructor(private readonly service: ISigninWithGoogleService) {}
	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(
				SigninWithGoogleInputServiceSchema,
				request.body,
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
