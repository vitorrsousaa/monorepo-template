import { randomUUID } from "node:crypto";
import type { ProjectMapper } from "@data/protocols/projects/project-mapper";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ProjectDynamoDBEntity } from "@infra/db/dynamodb/mappers/projects/types";
import type { Project } from "@repo/contracts/projects";
import type { IDatabaseClient } from "../../contracts/client";

/**
 * ProjectDynamoRepository
 *
 * DynamoDB-specific implementation for the Project repository.
 * This class abstracts all DynamoDB access logic, keeping
 * the rest of the application agnostic to the persistence technology.
 *
 * Uses a Mapper to convert between DB format and application format.
 */
export class ProjectDynamoRepository implements IProjectRepository {
	constructor(
		private readonly dynamoClient: IDatabaseClient,
		private readonly mapper: ProjectMapper<ProjectDynamoDBEntity>,
	) {}

	async getAllProjectsByUser(userId: string): Promise<Project[]> {
		const pk = `USER#${userId}`;
		const sk = "PROJECT#";

		const result = await this.dynamoClient.query<ProjectDynamoDBEntity[]>({
			KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
			ExpressionAttributeValues: {
				":pk": pk,
				":sk": sk,
				":null": null,
			},
			ExpressionAttributeNames: {
				"#deletedAt": "deleted_at",
			},
			FilterExpression:
				"attribute_not_exists(#deletedAt) OR #deletedAt = :null",
		});

		const projects = result || [];

		return projects.map((p) => this.mapper.toDomain(p));
	}

	async getById(projectId: string, userId: string): Promise<Project | null> {
		const pk = `USER#${userId}`;
		const sk = `PROJECT#${projectId}`;

		const result = await this.dynamoClient.get<ProjectDynamoDBEntity>({
			Key: {
				PK: pk,
				SK: sk,
			},
		});

		return result ? this.mapper.toDomain(result) : null;
	}

	async create(
		data: Omit<Project, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Project> {
		const projectId = randomUUID();
		const now = new Date();
		const isoNow = now.toISOString();

		const project: Project = {
			id: projectId,
			userId: data.userId,
			name: data.name,
			description: data.description,
			color: data.color,
			deletedAt: undefined,
			createdAt: isoNow,
			updatedAt: isoNow,
		};

		const dbEntity = this.mapper.toDatabase(project);

		await this.dynamoClient.create(dbEntity);

		return project;
	}
}
