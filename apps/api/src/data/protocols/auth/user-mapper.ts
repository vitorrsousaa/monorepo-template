import type { User } from "@repo/contracts/auth/entities";

export interface UserMapper<TDBEntity = unknown> {
	toDomain(dbEntity: TDBEntity): User;
	toDatabase(user: User): TDBEntity;
}
