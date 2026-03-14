import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { ICreateSectionService } from "@application/modules/sections/services/create-section";
import { createSectionSchema, type CreateSectionSchema } from "./schema";

export class CreateSectionController extends Controller {
	constructor(private readonly createSectionService: ICreateSectionService) {
		super();
	}

	protected override schema = createSectionSchema;

	protected override async handle(
		request: IRequest<CreateSectionSchema>,
	): Promise<IResponse> {
		const result = await this.createSectionService.execute({
			...request.body,
			userId: request.userId ?? "",
			projectId: (request.params.projectId as string) ?? "",
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
