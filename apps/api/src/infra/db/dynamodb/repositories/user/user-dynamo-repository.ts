import { UserMapper } from "@data/protocols/auth/user-mapper";
import { IUserRepository } from "@data/protocols/auth/user-repository";
import { User } from "@repo/contracts/auth/user";
import { UserDynamoDBEntity } from "../../mappers/user/types";

export class UserDynamoRepository implements IUserRepository {
	constructor(private readonly mapper: UserMapper<UserDynamoDBEntity>) {}

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

		return this.mapper.toDomain(dbEntity);
	}
}
