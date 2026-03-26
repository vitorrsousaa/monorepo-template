import type { UserSettings } from "@repo/contracts/settings/entities";

/**
 * IUserSettingsRepository
 *
 * Database-agnostic interface for UserSettings data access.
 * Defines all operations needed for UserSettings management.
 *
 * This interface abstracts persistence technology (DynamoDB, etc).
 * Repositories should return domain entities only, never DTOs.
 */
export interface IUserSettingsRepository {
	/**
	 * Create a new user (e.g. after Cognito signup).
	 * @param data - User data (id from Cognito sub, email, name; no timestamps)
	 * @returns Created user with generated createdAt/updatedAt
	 */
	create(
		data: Omit<UserSettings, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<UserSettings>;

	getByUserId(userId: string): Promise<UserSettings | null>;

	/**
	 * Partial update. Returns null if settings row is missing or soft-deleted.
	 */
	update(
		userId: string,
		data: Partial<UserSettings>,
	): Promise<UserSettings | null>;
}
