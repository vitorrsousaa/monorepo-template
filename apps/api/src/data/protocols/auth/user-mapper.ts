import { User } from "@repo/contracts/auth/user";

export interface UserMapper<TDBEntity = unknown> {
	toDomain(dbEntity: TDBEntity): User;
	toDatabase(user: User): TDBEntity;
}
