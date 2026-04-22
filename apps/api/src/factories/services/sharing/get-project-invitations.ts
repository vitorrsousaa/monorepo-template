import { GetProjectInvitationsService } from "@application/modules/sharing/services/get-project-invitations/service";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";
import { makePermissionService } from "./permission-service";

export function makeGetProjectInvitationsService(): GetProjectInvitationsService {
	return new GetProjectInvitationsService(
		makePermissionService(),
		makeSharingRepository(),
	);
}
