import { AcceptInvitationController } from "@application/modules/sharing/controllers/accept-invitation";
import { makeAcceptInvitationService } from "@factories/services/sharing/accept-invitation";

export function makeAcceptInvitationController(): AcceptInvitationController {
	return new AcceptInvitationController(makeAcceptInvitationService());
}
