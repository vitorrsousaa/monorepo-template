import { Controller } from "@application/interfaces/controller";
import type { IGetTodosService } from "@application/modules/todos/services/get-todos";
import { createLogger } from "@application/utils/logger";

const logger = createLogger("get-todos-controller");

export class GetTodosController extends Controller<"private"> {
	constructor(private readonly getTodosService: IGetTodosService) {
		super();
	}

	protected override async handle(
		_request: Controller.Request<"private">,
	): Promise<Controller.Response<undefined>> {
		logger.info("GetTodosController handle called");
		const result = await this.getTodosService.execute();
		return {
			statusCode: 200,
			body: result,
		};
	}
}
