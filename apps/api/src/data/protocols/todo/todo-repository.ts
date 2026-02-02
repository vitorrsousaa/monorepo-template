import type { Todo } from "@core/domain/todo/todo";

/**
 * ITodoRepository
 *
 * Database-agnostic interface for Todo data access.
 * Defines all operations needed for Todo management.
 *
 * This interface abstracts persistence technology (DynamoDB, Postgres, etc).
 */
export interface ITodoRepository {
	findInboxTodos(userId: string): Promise<Todo[]>;
	findAll(): Promise<Todo[]>;
	findById(id: string): Promise<Todo | null>;
	create(data: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
	update(id: string, data: Partial<Todo>): Promise<Todo | null>;
	delete(id: string): Promise<boolean>;

	/**
	 * Get all todos for a specific section
	 * Uses GSI3 per docs/database-design.md
	 * @param sectionId - Section ID
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Array of todos ordered by 'order' field
	 */
	getAllBySection(
		sectionId: string,
		projectId: string,
		userId: string,
	): Promise<Todo[]>;

	/**
	 * Get all todos for a project that have no section assigned
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Array of todos ordered by 'order' field
	 */
	getTodosByProjectWithoutSection(
		projectId: string,
		userId: string,
	): Promise<Todo[]>;
}
