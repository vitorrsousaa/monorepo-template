import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { GetTodosService } from "@application/modules/todo/services/get-todos";
import { errorHandler } from "@application/utils/error-handler";
import { createLogger } from "@application/utils/logger";

const logger = createLogger("get-todos-controller");

export class GetTodosController implements IController {
	constructor(private readonly getTodosService: GetTodosService) {}

	async handle(_request: IRequest): Promise<IResponse> {
		try {
			logger.info("GetTodosController handle called");
			const result = await this.getTodosService.execute();

			return {
				statusCode: 200,
				body: result,
			};
		} catch (error) {
			return errorHandler(error);
		}
	}
}
