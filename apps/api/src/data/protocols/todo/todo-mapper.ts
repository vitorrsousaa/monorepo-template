import type { Todo } from "@core/domain/todo/todo";

/**
 * TodoMapper
 *
 * Database-agnostic interface for mapping data between database and application.
 *
 * Responsibilities:
 * - Transform database data (e.g., snake_case) to domain (camelCase)
 * - Transform domain data to database format
 * - Abstract database structure details (PK/SK, GSI, etc)
 *
 * @template TDBEntity - Database entity type
 */
export interface TodoMapper<TDBEntity = unknown> {
	/**
	 * Maps database entity to application domain
	 * @param dbEntity - Entity returned from database
	 * @returns Todo - Domain entity
	 */
	toDomain(dbEntity: TDBEntity): Todo;

	/**
	 * Maps domain entity to database format
	 * @param todo - Domain entity
	 * @returns TDBEntity - Entity in database format
	 */
	toDatabase(todo: Todo): TDBEntity;
}
