import { UserMapper } from "@data/protocols/auth/user-mapper";
import { User } from "@repo/contracts/auth/user";
import { UserDynamoDBEntity } from "./types";

export class UserDynamoMapper implements UserMapper<UserDynamoDBEntity> {
  toDomain(dbEntity: UserDynamoDBEntity): User {
    return {
      id: dbEntity.id,
      email: dbEntity.email,
      name: dbEntity.name,
      createdAt: new Date(dbEntity.created_at).toISOString(),
      updatedAt: new Date(dbEntity.updated_at).toISOString(),
      deletedAt: dbEntity.deleted_at ? new Date(dbEntity.deleted_at).toISOString() : undefined,
    };
  }
  toDatabase(user: User): UserDynamoDBEntity {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: new Date(user.createdAt).toISOString(),
      updated_at: new Date(user.updatedAt).toISOString(),
      deleted_at: user.deletedAt ? new Date(user.deletedAt).toISOString() : undefined,
      PK: this.buildPK(user.id),
      SK: this.buildSK(user.id),
      entity_type: "USER",
    };
  }
  
  private buildPK(id: string): string {
    return `USER#${id}`;
  }
  private buildSK(id: string): string {
    return `PROFILE`;
  }
}