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
	getInbox(userId: string): Promise<Task[]>;
	create(
		data: Omit<
			Task,
			"id" | "createdAt" | "updatedAt" | "completedAt" | "completed" | "order"
		>,
	): Promise<Task>;

	/**
	 * Get tasks for Today view: dueDate <= today AND completed = false.
	 * Per domain rules: overdue tasks at top, grouped by project.
	 * Uses GSI1 (DueDateIndex) range query.
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Array of tasks (inbox and project) with dueDate <= today
	 */
	getTodayTasks(userId: string): Promise<Task[]>;

	/**
	 * Update a task's mutable fields.
	 * If projectId changes, performs a delete+put transaction (PK changes).
	 * Otherwise uses UpdateItem on the existing item.
	 * @param task - Current task (used to derive old PK/SK)
	 * @param updates - Partial set of fields to update
	 * @returns The updated task
	 */
	updateTask(
		task: Task,
		updates: Partial<
			Pick<
				Task,
				| "title"
				| "description"
				| "priority"
				| "dueDate"
				| "recurrence"
				| "sectionId"
				| "projectId"
				| "updatedAt"
			>
		>,
	): Promise<Task>;

	/**
	 * Lightweight single-field patch using UpdateItem.
	 * Used for setting `nextTaskId` on a completed recurring task.
	 * @param taskId - Task ID (for filter)
	 * @param userId - User ID (for PK construction)
	 * @param projectId - Project ID (for PK construction; null for inbox)
	 * @param field - Attribute name to update
	 * @param value - New value for the attribute
	 */
	updateField(
		taskId: string,
		userId: string,
		projectId: string | null,
		field: string,
		value: unknown,
	): Promise<void>;

	/**
	 * Get all pending tasks for a project (with or without section)
	 * Uses PK = USER#userId#PROJECT#projectId, SK begins_with TASK#PENDING#
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Array of pending tasks ordered by SK
	 */
	getAllPendingByProject(projectId: string, userId: string): Promise<Task[]>;

	/**
	 * Get pending and completed task counts for a project
	 * Uses PK = USER#userId#PROJECT#projectId with SK prefix filters
	 * @param projectId - Project ID
	 * @param userId - User ID (for multi-tenancy)
	 * @returns Object with pending and completed counts
	 */
	getTaskCountsByProject(
		projectId: string,
		userId: string,
	): Promise<{ pending: number; completed: number }>;

	/**
	 * Find a task by ID for a given user.
	 * Queries PK (inbox or project) and filters by id attribute.
	 * Returns both PENDING and COMPLETED tasks.
	 * @param taskId - Task ID
	 * @param userId - User ID (for multi-tenancy)
	 * @param projectId - Project ID (null for inbox tasks)
	 * @returns Task or null if not found
	 */
	getByUserId(
		taskId: string,
		userId: string,
		projectId: string | null | undefined,
	): Promise<Task | null>;

	/**
	 * Update task completion status.
	 * Because SK changes (PENDING ↔ COMPLETED), this performs a delete of the
	 * old item followed by a put of the new item.
	 * @param oldTask - Task in its current state (used to derive the old SK)
	 * @param updatedTask - Task with the new completion state
	 * @returns The updated task
	 */
	updateCompletion(oldTask: Task, updatedTask: Task): Promise<Task>;
}
