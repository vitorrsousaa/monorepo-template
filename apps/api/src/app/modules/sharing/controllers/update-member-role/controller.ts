import { Controller } from "@application/interfaces/controller";
import type { IUpdateMemberRoleService } from "@application/modules/sharing/services/update-member-role";
import type { SharingRole } from "@repo/contracts/sharing/types";
import { updateMemberRoleSchema } from "@repo/contracts/sharing/update-member-role";
import type { UpdateMemberRoleResponse } from "@repo/contracts/sharing/update-member-role";

export class UpdateMemberRoleController extends Controller<
	"private",
	UpdateMemberRoleResponse,
	{ role: Exclude<SharingRole, "owner"> },
	{ projectId: string; memberId: string }
> {
	protected schema = updateMemberRoleSchema;

	constructor(private readonly service: IUpdateMemberRoleService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<
			"private",
			{ role: Exclude<SharingRole, "owner"> },
			{ projectId: string; memberId: string }
		>,
	): Promise<Controller.Response<UpdateMemberRoleResponse>> {
		const { projectId, memberId } = request.params;
		const { role } = request.body;

		await this.service.execute({
			userId: request.userId,
			projectId,
			memberId,
			role,
		});

		return { statusCode: 200, body: { ok: true } };
	}
}
