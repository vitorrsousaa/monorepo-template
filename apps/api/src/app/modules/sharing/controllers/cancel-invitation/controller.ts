import { Controller } from "@application/interfaces/controller";
import type { ICancelInvitationService } from "@application/modules/sharing/services/cancel-invitation";
import type { CancelInvitationResponse } from "@repo/contracts/sharing/cancel-invitation";

export class CancelInvitationController extends Controller<
	"private",
	CancelInvitationResponse,
	Record<string, never>,
	{ projectId: string; invitationId: string }
> {
	constructor(private readonly service: ICancelInvitationService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			Record<string, never>,
			{ projectId: string; invitationId: string }
		>,
	): Promise<Controller.Response<CancelInvitationResponse>> {
		const { projectId, invitationId } = request.params;

		await this.service.execute({
			userId: request.userId,
			projectId,
			invitationId,
		});

		return { statusCode: 200, body: { ok: true } };
	}
}
