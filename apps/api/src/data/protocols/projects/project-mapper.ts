import type { Project } from "@core/domain/project/project";

/**
 * ProjectMapper
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
export interface ProjectMapper<TDBEntity = unknown> {
  /**
   * Maps database entity to application domain
   * @param dbEntity - Entity returned from database
   * @returns :Project - Domain entity
   */
  toDomain(dbEntity: TDBEntity): Project;

  /**
   * Maps domain entity to database format
   * @param project - Domain entity
   * @returns TDBEntity - Entity in database format
   */
  toDatabase(todo: Project): TDBEntity;
}
