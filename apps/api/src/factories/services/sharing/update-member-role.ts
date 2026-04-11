import { UpdateMemberRoleService } from "@application/modules/sharing/services/update-member-role";
import type { IUpdateMemberRoleService } from "@application/modules/sharing/services/update-member-role";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";
import { makePermissionService } from "./permission-service";

export function makeUpdateMemberRoleService(): IUpdateMemberRoleService {
	return new UpdateMemberRoleService(
		makePermissionService(),
		makeSharingRepository(),
		makeProjectDynamoRepository(),
	);
}
