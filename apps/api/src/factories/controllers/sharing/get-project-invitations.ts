import { GetProjectInvitationsController } from "@application/modules/sharing/controllers/get-project-invitations";
import { makeGetProjectInvitationsService } from "@factories/services/sharing/get-project-invitations";

export function makeGetProjectInvitationsController(): GetProjectInvitationsController {
	return new GetProjectInvitationsController(
		makeGetProjectInvitationsService(),
	);
}
