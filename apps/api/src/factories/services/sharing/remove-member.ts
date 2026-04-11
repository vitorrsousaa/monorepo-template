import { RemoveMemberService } from "@application/modules/sharing/services/remove-member";
import type { IRemoveMemberService } from "@application/modules/sharing/services/remove-member";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";
import { makePermissionService } from "./permission-service";

export function makeRemoveMemberService(): IRemoveMemberService {
	return new RemoveMemberService(
		makePermissionService(),
		makeSharingRepository(),
		makeProjectDynamoRepository(),
	);
}
