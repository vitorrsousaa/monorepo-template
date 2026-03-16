import { IUserRepository } from "@data/protocols/auth/user-repository";
import { UserDynamoMapper } from "@infra/db/dynamodb/mappers/user/user-mapper";
import { UserDynamoRepository } from "@infra/db/dynamodb/repositories/user/user-dynamo-repository";



export function makeUserDynamoRepository(): IUserRepository {
	const mapper = new UserDynamoMapper();
	const userRepositoryInstance = new UserDynamoRepository(mapper);

	return userRepositoryInstance;
}
