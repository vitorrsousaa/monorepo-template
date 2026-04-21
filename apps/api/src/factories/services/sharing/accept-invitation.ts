import { AcceptInvitationService } from "@application/modules/sharing/services/accept-invitation";
import type { IAcceptInvitationService } from "@application/modules/sharing/services/accept-invitation";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";
import { makeUserDynamoRepository } from "@infra/db/dynamodb/factories/user-repository-factory";

export function makeAcceptInvitationService(): IAcceptInvitationService {
	return new AcceptInvitationService(
		makeSharingRepository(),
		makeUserDynamoRepository(),
		makeProjectDynamoRepository(),
	);
}
