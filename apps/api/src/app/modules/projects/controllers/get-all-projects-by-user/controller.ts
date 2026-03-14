import { Controller } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import type { IGetAllProjectsByUserService } from "@application/modules/projects/services/get-all-projects-by-user";
import { GetAllProjectsByUserSchema, getAllProjectsByUserSchema } from "./schema";

export class GetAllProjectsByUserController extends Controller {
	constructor(
		private readonly getAllProjectsByUserService: IGetAllProjectsByUserService,
	) {
		super();
	}
	
	protected override schema = getAllProjectsByUserSchema;

	protected override async handle(request: IRequest<GetAllProjectsByUserSchema>): Promise<IResponse> {
	
	

			const result = await this.getAllProjectsByUserService.execute({userId: request.userId || ""});

			return {
				statusCode: 200,
				body: result,
			};
		
	}
}
