import { Controller } from "@application/interfaces/controller";
import type { IAcceptInvitationService } from "@application/modules/sharing/services/accept-invitation";
import type { AcceptInvitationResponse } from "@repo/contracts/sharing/accept-invitation";

export class AcceptInvitationController extends Controller<
	"private",
	AcceptInvitationResponse,
	Record<string, never>,
	{ invitationId: string }
> {
	constructor(private readonly service: IAcceptInvitationService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			Record<string, never>,
			{ invitationId: string }
		>,
	): Promise<Controller.Response<AcceptInvitationResponse>> {
		const { invitationId } = request.params;

		await this.service.execute({
			userId: request.userId,
			invitationId,
		});

		return { statusCode: 200, body: { ok: true } };
	}
}
