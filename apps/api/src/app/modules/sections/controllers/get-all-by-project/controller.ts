import { Controller } from "@application/interfaces/controller";
import type { IGetAllByProjectService } from "@application/modules/sections/services/get-all-by-project";

export class GetAllByProjectController extends Controller<"private"> {
	constructor(
		private readonly getAllByProjectService: IGetAllByProjectService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<undefined>> {
		const result = await this.getAllByProjectService.execute({
			userId: request.userId,
			projectId: (request.params.projectId as string) ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
