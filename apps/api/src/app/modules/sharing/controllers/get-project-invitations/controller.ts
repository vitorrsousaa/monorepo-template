import { Controller } from "@application/interfaces/controller";
import type { IGetProjectInvitationsService } from "@application/modules/sharing/services/get-project-invitations";
import type { GetProjectInvitationsResponse } from "@repo/contracts/sharing/get-project-invitations";

export class GetProjectInvitationsController extends Controller<
	"private",
	GetProjectInvitationsResponse,
	Record<string, never>,
	{ projectId: string }
> {
	constructor(private readonly service: IGetProjectInvitationsService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			Record<string, never>,
			{ projectId: string }
		>,
	): Promise<Controller.Response<GetProjectInvitationsResponse>> {
		const { projectId } = request.params;

		const { invitations } = await this.service.execute({
			userId: request.userId,
			projectId,
		});

		return { statusCode: 200, body: { invitations } };
	}
}
