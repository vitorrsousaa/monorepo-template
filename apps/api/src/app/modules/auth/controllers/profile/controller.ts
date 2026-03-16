import { Controller } from "@application/interfaces/controller";
import type { IProfileService } from "@application/modules/auth/services/profile";
import type { ProfileResponse } from "@repo/contracts/auth/profile";

export class ProfileController extends Controller<"private", ProfileResponse> {
	constructor(private readonly profileService: IProfileService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<ProfileResponse>> {
		const result = await this.profileService.execute({
			userId: request.userId,
		});
		return {
			statusCode: 200,
			body: { user: result.user },
		};
	}
}
