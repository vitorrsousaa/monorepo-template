import {
	CreateSectionService,
	type ICreateSectionService,
} from "@application/modules/sections/services/create-section";
import { makePermissionService } from "@factories/services/sharing/permission-service";
import { makeSectionDynamoRepository } from "@infra/db/dynamodb/factories/section-repository-factory";

export function makeCreateSectionService(): ICreateSectionService {
	const sectionRepository = makeSectionDynamoRepository();

	return new CreateSectionService(sectionRepository, makePermissionService());
}
