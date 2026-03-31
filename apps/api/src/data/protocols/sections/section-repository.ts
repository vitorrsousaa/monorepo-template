import type { Section } from "@repo/contracts/sections/entities";

/**
 * ISectionRepository
 *
 * Database-agnostic interface for Section data access.
 * Defines all operations needed for Section management.
 *
 * This interface abstracts persistence technology (DynamoDB, Postgres, etc).
 */
export interface ISectionRepository {
	/**
	 * Get all sections for a specific project
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Array of sections ordered by 'order' field
	 */
	getAllByProject(projectId: string, userId: string): Promise<Section[]>;

	/**
	 * Create a new section
	 * @param data - Section data (without id, createdAt, updatedAt)
	 * @returns Created section with generated fields
	 */
	create(
		data: Omit<Section, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Section>;

	/**
	 * Soft delete a section
	 * @param sectionId - Section ID
	 * @param projectId - Project ID
	 * @param userId - User ID
	 * @returns true if deleted, false if not found
	 */
	delete(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<boolean>;
}
