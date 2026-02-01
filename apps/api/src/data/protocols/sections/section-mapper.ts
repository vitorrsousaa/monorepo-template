import type { Section } from "@core/domain/section/section";

/**
 * SectionMapper
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
export interface SectionMapper<TDBEntity = unknown> {
	/**
	 * Maps database entity to application domain
	 * @param dbEntity - Entity returned from database
	 * @returns Section - Domain entity
	 */
	toDomain(dbEntity: TDBEntity): Section;

	/**
	 * Maps domain entity to database format
	 * @param section - Domain entity
	 * @returns TDBEntity - Entity in database format
	 */
	toDatabase(section: Section): TDBEntity;
}
