import { Controller } from "@application/interfaces/controller";
import type { ICreateProjectService } from "@application/modules/projects/services/create-project";
import {
	type CreateProjectInput,
	createProjectSchema,
	type CreateProjectOutput,
} from "@repo/contracts/projects/create";

export class CreateProjectController extends Controller<
	"private",
	CreateProjectOutput
> {
	constructor(private readonly createProjectService: ICreateProjectService) {
		super();
	}

	protected override schema = createProjectSchema;

	protected override async handle(
		request: Controller.Request<"private", CreateProjectInput>,
	): Promise<Controller.Response<CreateProjectOutput>> {
		const result = await this.createProjectService.execute({
			...request.body,
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
