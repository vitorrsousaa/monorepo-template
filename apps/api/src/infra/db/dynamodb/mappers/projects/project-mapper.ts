import type { Project } from "@core/domain/project/project";
import type { ProjectMapper } from "@data/protocols/projects/project-mapper";
import type { ProjectDynamoDBEntity } from "./types";

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "PROJECT#";

function buildPK(userId: string): string {
	return `${USER_PREFIX}${userId}`;
}

function buildSK(projectId: string): string {
	return `${PROJECT_PREFIX}${projectId}`;
}

function buildGSI6SK(name: string, projectId: string): string {
	return `${PROJECT_PREFIX}${name}#${projectId}`;
}

export class ProjectDynamoMapper
	implements ProjectMapper<ProjectDynamoDBEntity>
{
	/**
	 * Maps DynamoDB entity to domain
	 *
	 * @param dbEntity - DynamoDB entity (snake_case, with PK/SK)
	 * @returns Project - Domain entity (camelCase, clean)
	 */
	toDomain(dbEntity: ProjectDynamoDBEntity): Project {
		return {
			id: dbEntity.id,
			userId: dbEntity.user_id,
			name: dbEntity.name,
			description: dbEntity.description ?? undefined,
			deletedAt: dbEntity.deleted_at
				? new Date(dbEntity.deleted_at)
				: undefined,
			createdAt: new Date(dbEntity.created_at),
			updatedAt: new Date(dbEntity.updated_at),
		};
	}

	/**
	 * Maps domain entity to DynamoDB
	 *
	 * @param project - Domain entity (camelCase)
	 * @returns ProjectDynamoDBEntity - DynamoDB entity (snake_case, with PK/SK)
	 */
	toDatabase(project: Project): ProjectDynamoDBEntity {
		const pk = buildPK(project.userId);
		const sk = buildSK(project.id);
		const gsi6sk = buildGSI6SK(project.name, project.id);

		return {
			PK: pk,
			SK: sk,
			GSI6PK: pk,
			GSI6SK: gsi6sk,
			id: project.id,
			user_id: project.userId,
			name: project.name,
			description: project.description ?? null,
			deleted_at: project.deletedAt?.toISOString() ?? null,
			created_at: project.createdAt.toISOString(),
			updated_at: project.updatedAt.toISOString(),
			entity_type: "PROJECT",
		};
	}
}
