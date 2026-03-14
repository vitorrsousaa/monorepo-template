import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IGetAllByProjectService } from "@application/modules/sections/services/get-all-by-project";

export class GetAllByProjectController extends Controller {
	constructor(
		private readonly getAllByProjectService: IGetAllByProjectService,
	) {
		super();
	}

	protected override async handle(request: IRequest): Promise<IResponse> {
		const result = await this.getAllByProjectService.execute({
			userId: request.userId ?? "",
			projectId: (request.params.projectId as string) ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
