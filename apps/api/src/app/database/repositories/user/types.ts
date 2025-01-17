import type { TBaseEntity, TBaseIndexes } from "@application/database/entities";
import type { Prettify } from "@application/utils/types";
import type { User } from "@core/domain/user";

/**
 * This entity is used to send user for dynamoDB with SK and PK.
 * PK - USER
 * SK - USER|uuid
 */
export type UserDynamoDB = Prettify<
	{
		name: string;
		email: string;
		created_at: string;
		updated_at: string;
		customer_id: string;
		subscription_id: string;
		subscription_status: string;
		price_id: string;
	} & TBaseEntity &
		Omit<
			User,
			| "updatedAt"
			| "createdAt"
			| "customerId"
			| "subscriptionId"
			| "subscriptionStatus"
			| "priceId"
		> &
		TBaseIndexes
>;

export interface IUserRepository {
	create(createInput: Omit<User, "createdAt" | "updatedAt">): Promise<User>;
	getById(id: string): Promise<User | undefined>;
}
