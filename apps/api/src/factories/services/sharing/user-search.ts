import type { IUserSearchService } from "@application/modules/sharing/services/user-search";
import { UserSearchService } from "@application/modules/sharing/services/user-search";
import { makeSharingRepository } from "@infra/db/dynamodb/factories/sharing-repository-factory";
import { makeUserDynamoRepository } from "@infra/db/dynamodb/factories/user-repository-factory";

export function makeUserSearchService(): IUserSearchService {
	return new UserSearchService(
		makeSharingRepository(),
		makeUserDynamoRepository(),
	);
}
