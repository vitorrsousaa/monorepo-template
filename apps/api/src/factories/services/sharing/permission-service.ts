import { PermissionService } from "@application/modules/sharing/services/permission";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import { makeProjectDynamoRepository } from "@infra/db/dynamodb/factories/project-repository-factory";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";

export function makePermissionService(): IPermissionService {
	return new PermissionService(
		makeProjectDynamoRepository(),
		makeSharingRepository(),
	);
}
