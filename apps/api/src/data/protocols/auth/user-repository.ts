import type { User } from "@repo/contracts/auth/user";

/**
 * IUserRepository
 *
 * Database-agnostic interface for User data access.
 * Defines all operations needed for User management.
 *
 * This interface abstracts persistence technology (DynamoDB, etc).
 * Repositories should return domain entities only, never DTOs.
 */
export interface IUserRepository {
	/**
	 * Create a new user (e.g. after Cognito signup).
	 * @param data - User data (id from Cognito sub, email, name; no timestamps)
	 * @returns Created user with generated createdAt/updatedAt
	 */
	create(
		data: Omit<User, "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<User>;

	getById(userId: string): Promise<User | null>;
}
