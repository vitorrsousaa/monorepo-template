import { Controller } from "@application/interfaces/controller";
import { IProjectParams } from "@application/interfaces/params";
import type { ICreateSectionService } from "@application/modules/sections/services/create-section";

import {
	createSectionSchema,
	type CreateSectionInput,
	type CreateSectionOutput,
} from "@repo/contracts/sections/create";

export class CreateSectionController extends Controller<
	"private",
	CreateSectionOutput,
	CreateSectionInput,
	IProjectParams
> {
	constructor(private readonly createSectionService: ICreateSectionService) {
		super();
	}

	protected override schema = createSectionSchema;

	protected override async handle(
		request: Controller.Request<"private", CreateSectionInput, IProjectParams>,
	): Promise<Controller.Response<CreateSectionOutput>> {
		const result = await this.createSectionService.execute({
			...request.body,
			userId: request.userId,
			projectId: request.params.projectId,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
