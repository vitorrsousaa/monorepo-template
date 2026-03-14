import { Controller } from "@application/interfaces/controller";
import type { ICreateSectionService } from "@application/modules/sections/services/create-section";
import { createSectionSchema, type CreateSectionSchema } from "./schema";

export class CreateSectionController extends Controller<"private"> {
	constructor(private readonly createSectionService: ICreateSectionService) {
		super();
	}

	protected override schema = createSectionSchema;

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<undefined>> {
		const body = request.body as CreateSectionSchema;
		const result = await this.createSectionService.execute({
			...body,
			userId: request.userId,
			projectId: (request.params.projectId as string) ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
