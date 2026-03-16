import type { Todo } from "@core/domain/todo/todo";
import type { Task } from "@repo/contracts/tasks";

/**
 * ITasksRepository
 *
 * Database-agnostic interface for Tasks data access.
 * Defines all operations needed for Tasks management.
 *
 * This interface abstracts persistence technology (DynamoDB, Postgres, etc).
 */
export interface ITasksRepository {
	findInboxTasks(userId: string): Promise<Task[]>;
	create(
		data: Omit<
			Task,
			"id" | "createdAt" | "updatedAt" | "completedAt" | "completed" | "order"
		>,
	): Promise<Task>;

	/**
	 * Get todos for Today view: dueDate <= today AND completed = false.
	 * Per domain rules: overdue tasks at top, grouped by project.
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Array of todos (inbox and project) with dueDate <= today
	 */
	findTodayTodos(userId: string): Promise<Todo[]>;

	findAll(): Promise<Todo[]>;
	findById(id: string): Promise<Todo | null>;
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
