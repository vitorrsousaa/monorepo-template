import { Controller } from "@application/interfaces/controller";
import type { IRemoveMemberService } from "@application/modules/sharing/services/remove-member";
import type { RemoveMemberResponse } from "@repo/contracts/sharing/remove-member";

export class RemoveMemberController extends Controller<
	"private",
	RemoveMemberResponse,
	Record<string, never>,
	{ projectId: string; memberId: string }
> {
	constructor(private readonly service: IRemoveMemberService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			Record<string, never>,
			{ projectId: string; memberId: string }
		>,
	): Promise<Controller.Response<RemoveMemberResponse>> {
		const { projectId, memberId } = request.params;

		await this.service.execute({
			userId: request.userId,
			projectId,
			memberId,
		});

		return { statusCode: 200, body: { ok: true } };
	}
}
