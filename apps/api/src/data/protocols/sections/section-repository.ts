import type { Section } from "@core/domain/section/section";

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
	 * Get a specific section by ID
	 * @param sectionId - Section ID
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Section or null if not found
	 */
	getById(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<Section | null>;

	/**
	 * Create a new section
	 * @param data - Section data (without id, createdAt, updatedAt)
	 * @returns Created section with generated fields
	 */
	create(
		data: Omit<Section, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Section>;

	/**
	 * Update an existing section
	 * @param sectionId - Section ID
	 * @param projectId - Project ID
	 * @param userId - User ID
	 * @param data - Partial section data to update
	 * @returns Updated section or null if not found
	 */
	update(
		sectionId: string,
		projectId: string,
		userId: string,
		data: Partial<Section>,
	): Promise<Section | null>;

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
