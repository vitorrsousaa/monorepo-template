import {
	CancelInvitationService,
	type ICancelInvitationService,
} from "@application/modules/sharing/services/cancel-invitation";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";
import { makePermissionService } from "./permission-service";

export function makeCancelInvitationService(): ICancelInvitationService {
	return new CancelInvitationService(
		makePermissionService(),
		makeSharingRepository(),
	);
}
