import type { IUserRepository } from "@data/protocols/auth/user-repository";
import { UserDynamoMapper } from "@infra/db/dynamodb/mappers/user/user-mapper";
import { UserDynamoRepository } from "@infra/db/dynamodb/repositories/user/user-dynamo-repository";
import { makeDatabaseClient } from "./client/database-client-factory";

export function makeUserDynamoRepository(): IUserRepository {
	const mapper = new UserDynamoMapper();
	const databaseClient = makeDatabaseClient();
	const userRepositoryInstance = new UserDynamoRepository(
		databaseClient,
		mapper,
	);

	return userRepositoryInstance;
}
