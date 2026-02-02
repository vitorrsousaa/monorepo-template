import {
	GetAllByProjectService,
	type IGetAllByProjectService,
} from "@application/modules/sections/services/get-all-by-project";
import { makeSectionDynamoRepository } from "@infra/db/dynamodb/factories/section-repository-factory";

export function makeGetAllByProjectService(): IGetAllByProjectService {
	const sectionRepository = makeSectionDynamoRepository();

	return new GetAllByProjectService(sectionRepository);
}
