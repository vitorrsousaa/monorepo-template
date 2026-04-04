import { Controller } from "@application/interfaces/controller";
import type { IUserSearchService } from "@application/modules/sharing/services/user-search";
import type { UserSearchResponse } from "@repo/contracts/sharing/user-search";

export class UserSearchController extends Controller<
	"private",
	UserSearchResponse
> {
	constructor(private readonly service: IUserSearchService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"private">,
	): Promise<Controller.Response<UserSearchResponse>> {
		const email = request.queryParams.email ?? "";

		const { user } = await this.service.execute({ email });

		return {
			statusCode: 200,
			body: { users: user ? [user] : [] },
		};
	}
}
