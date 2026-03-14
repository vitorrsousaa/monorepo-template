import { Controller } from "@application/interfaces/controller";
import type { ICreateProjectService } from "@application/modules/projects/services/create-project";
import { createProjectSchema, type CreateProjectSchema } from "./schema";

export class CreateProjectController extends Controller<"private"> {
	constructor(private readonly createProjectService: ICreateProjectService) {
		super();
	}

	protected override schema = createProjectSchema;

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<undefined>> {
		const body = request.body as CreateProjectSchema;
		const result = await this.createProjectService.execute({
			...body,
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
