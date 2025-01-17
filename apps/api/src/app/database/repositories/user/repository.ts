import type { IDatabaseClient } from "@application/database/database";
import type { TBaseIndexes } from "@application/database/entities";
import type { User } from "@core/domain/user";
import type { IUserRepository, UserDynamoDB } from "./types";

export class UserRepository implements IUserRepository {
	constructor(private readonly dbInstance: IDatabaseClient) {}

	async create(
		createInput: Omit<User, "createdAt" | "updatedAt">,
	): Promise<User> {
		const now = new Date().toISOString();

		const dynamoUser = this.mapToDynamoDB({
			...createInput,
			createdAt: now,
			updatedAt: now,
		});

		await this.dbInstance.create({
			...dynamoUser,
		});

		return this.mapToDomain(dynamoUser);
	}

	async getById(email: string): Promise<User | undefined> {
		const { PK, SK } = this.getKeys(email);

		const item = await this.dbInstance.get<UserDynamoDB>({
			Key: { PK, SK },
		});

		return item ? this.mapToDomain(item) : undefined;
	}

	private mapToDomain(item: UserDynamoDB): User {
		return {
			email: item.email,
			id: item.id,
			name: item.name,
			createdAt: item.created_at,
			updatedAt: item.updated_at,
			picture: item.picture,
			customerId: item.customer_id,
			priceId: item.price_id,
			subscriptionId: item.subscription_id,
			subscriptionStatus: item.subscription_status,
		};
	}

	private mapToDynamoDB(item: User): UserDynamoDB {
		const { PK, SK } = this.getKeys(item.id);
		const { gsi1pk, gsi1sk } = this.getSecondaryIndexes(
			item.customerId,
			item.subscriptionId,
		);

		return {
			email: item.email,
			id: item.id,
			name: item.name,
			created_at: item.createdAt,
			updated_at: item.updatedAt,
			picture: item.picture,
			customer_id: item.customerId,
			price_id: item.priceId,
			subscription_id: item.subscriptionId,
			subscription_status: item.subscriptionStatus,
			gsi1pk,
			gsi1sk,
			PK,
			SK,
		};
	}

	private getSecondaryIndexes(
		customerId: string,
		subscriptionId: string,
	): TBaseIndexes {
		return {
			gsi1pk: `CUSTOMER_ID#${customerId}`,
			gsi1sk: `SUBSCRIPTION_ID#${subscriptionId}`,
		};
	}

	private getKeys(id: string): { PK: string; SK: string } {
		return {
			SK: `USER#${id}`,
			PK: "PROFILE",
		};
	}
}
