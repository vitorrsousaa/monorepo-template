import { Controller } from "@application/interfaces/controller";
import type { GetInboxTasksResponse } from "@repo/contracts/tasks/inbox";
import type { IGetInboxTasksService } from "../../services/get-inbox-tasks";

export class GetInboxTasksController extends Controller<
	"private",
	GetInboxTasksResponse
> {
	constructor(private readonly getInboxService: IGetInboxTasksService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<GetInboxTasksResponse>> {
		const result = await this.getInboxService.execute({
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
