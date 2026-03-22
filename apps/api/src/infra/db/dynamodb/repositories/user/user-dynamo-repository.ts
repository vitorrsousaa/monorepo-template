import type { UserMapper } from "@data/protocols/auth/user-mapper";
import type { IUserRepository } from "@data/protocols/auth/user-repository";
import type { User } from "@repo/contracts/auth/entities";
import type {
	IDatabaseClient,
	IDatabaseClientGetArgs,
} from "@infra/db/dynamodb/contracts/client";
import type { UserDynamoDBEntity } from "@infra/db/dynamodb/mappers/user/types";

export class UserDynamoRepository implements IUserRepository {
	constructor(
		private readonly dynamoClient: IDatabaseClient,
		private readonly mapper: UserMapper<UserDynamoDBEntity>,
	) {}

	async create(
		data: Omit<User, "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<User> {
		const now = new Date();
		const newUser: User = {
			...data,
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
		};
		const dbEntity = this.mapper.toDatabase(newUser);

		await this.dynamoClient.create(dbEntity);

		return newUser;
	}

	async getById(userId: string): Promise<User | null> {
		const getArgs: IDatabaseClientGetArgs = {
			Key: {
				PK: `USER#${userId}`,
				SK: `PROFILE`,
			},
		};

		const dbEntity = await this.dynamoClient.get<UserDynamoDBEntity>(getArgs);

		return dbEntity ? this.mapper.toDomain(dbEntity) : null;
	}
}
