import type { ProjectMapper } from "@data/protocols/projects/project-mapper";
import type { Project } from "@repo/contracts/projects";
import type { ProjectDynamoDBEntity } from "./types";

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "PROJECT#";

function buildPK(userId: string): string {
	return `${USER_PREFIX}${userId}`;
}

function buildSK(projectId: string): string {
	return `${PROJECT_PREFIX}${projectId}`;
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
			color: dbEntity.color,
			description: dbEntity.description ?? null,
			deletedAt: dbEntity.deleted_at
				? new Date(dbEntity.deleted_at).toISOString()
				: undefined,
			createdAt: new Date(dbEntity.created_at).toISOString(),
			updatedAt: new Date(dbEntity.updated_at).toISOString(),
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

		return {
			PK: pk,
			SK: sk,
			id: project.id,
			user_id: project.userId,
			name: project.name,
			description: project?.description ?? null,
			color: project.color,
			deleted_at: project?.deletedAt ?? null,
			created_at: project.createdAt,
			updated_at: project.updatedAt,
			entity_type: "PROJECT",
		};
	}
}
