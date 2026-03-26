import { Controller } from "@application/interfaces/controller";
import { IGetUserSettingsService } from "@application/modules/settings/services/get-user-settings";
import { GetByUserSettingsResponse } from "@repo/contracts/settings/get-by-user";


export class GetUserSettingsController extends Controller<
	"private",
	GetByUserSettingsResponse
> {
	constructor(
		private readonly getUserSettingsService: IGetUserSettingsService,
	) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private"
		>,
	): Promise<Controller.Response<GetByUserSettingsResponse>> {
		const result = await this.getUserSettingsService.execute({
			userId: request.userId,
		});
		
		return {
			statusCode: 200,
			body: result,
		};
	}
}
