import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { IGetInboxTodosService } from "@application/modules/todo/services/get-inbox-todos";
import { getInboxTodosSchema } from "./schema";

export class GetInboxTodosController implements IController {
	constructor(private readonly getInboxTodosService: IGetInboxTodosService) {}

	async handle(request: IRequest): Promise<IResponse> {
		try {
			const [status, parsedBody] = missingFields(getInboxTodosSchema, {
				...request.body,
				userId: request.userId || "",
			});

			if (!status) return parsedBody;

			const result = await this.getInboxTodosService.execute(parsedBody);

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
