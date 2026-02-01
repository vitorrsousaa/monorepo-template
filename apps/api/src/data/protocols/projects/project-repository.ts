import type { Project } from "@core/domain/project/project";

/**
 * IProjectRepository
 *
 * Database-agnostic interface for Project data access.
 * Defines all operations needed for Project management.
 *
 * This interface abstracts persistence technology (DynamoDB, Postgres, etc).
 * Repositories should return domain entities only, never DTOs.
 */
export interface IProjectRepository {
	/**
	 * Get all projects for a specific user
	 * @param userId - User ID
	 * @returns Array of projects (excludes soft-deleted)
	 */
	getAllProjectsByUser(userId: string): Promise<Project[]>;

	/**
	 * Get a specific project by ID
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Project or null if not found
	 */
	getById(projectId: string, userId: string): Promise<Project | null>;

	/**
	 * Create a new project
	 * @param data - Project data (without id, createdAt, updatedAt, deletedAt)
	 * @returns Created project with generated fields
	 */
	create(
		data: Omit<Project, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Project>;
}
