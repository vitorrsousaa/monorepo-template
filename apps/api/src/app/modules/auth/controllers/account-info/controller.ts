import { Controller } from "@application/interfaces/controller";
import type { IGetAccountInfoService } from "@application/modules/auth/services/account-info";
import type { GetAccountInfoResponse } from "@repo/contracts/auth/account";

export class GetAccountInfoController extends Controller<"private", GetAccountInfoResponse> {
	constructor(private readonly profileService: IGetAccountInfoService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<GetAccountInfoResponse>> {
		const result = await this.profileService.execute({
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: { user: result.user },
		};
	}
}
