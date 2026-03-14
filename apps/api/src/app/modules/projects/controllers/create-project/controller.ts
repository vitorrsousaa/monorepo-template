import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { ICreateProjectService } from "@application/modules/projects/services/create-project";
import { createProjectSchema, type CreateProjectSchema } from "./schema";

export class CreateProjectController extends Controller {
	constructor(private readonly createProjectService: ICreateProjectService) {
		super();
	}

	protected override schema = createProjectSchema;

	protected override async handle(
		request: IRequest<CreateProjectSchema>,
	): Promise<IResponse> {
		const result = await this.createProjectService.execute({
			...request.body,
			userId: request.userId ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
