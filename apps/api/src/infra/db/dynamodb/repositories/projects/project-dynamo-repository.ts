import type { Project } from "@core/domain/project/project";
import type { ProjectMapper } from "@data/protocols/projects/project-mapper";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ProjectDynamoDBEntity } from "@infra/db/dynamodb/mappers/projects/types";
import { randomUUID } from "node:crypto";
import { PROJECT_DYNAMO_MOCKS } from "./project-dynamo-repository-mocks";

/**
 * ProjectDynamoRepository
 *
 * DynamoDB-specific implementation for the Project repository.
 * This class abstracts all DynamoDB access logic, keeping
 * the rest of the application agnostic to the persistence technology.
 *
 * Uses a Mapper to convert between DB format and application format.
 *
 * TODO: Implement real DynamoDB integration
 * For now, keeps data in memory for development (see project-dynamo-repository-mocks.ts).
 */
export class ProjectDynamoRepository implements IProjectRepository {
	// TODO: Replace with DynamoDB client
	// private dynamoClient: DynamoDBDocumentClient;
	// private tableName: string;

	// Temporary: In-memory simulation using shared mocks (PK = USER#userId per docs/database-design.md)
	private dbProjects: ProjectDynamoDBEntity[] = [...PROJECT_DYNAMO_MOCKS];

	constructor(private readonly mapper: ProjectMapper<ProjectDynamoDBEntity>) {}

	async getAllProjectsByUser(userId: string): Promise<Project[]> {
		// Docs: PK = USER#userId AND SK begins_with PROJECT#
		// TODO: DynamoDB Query KeyConditionExpression: PK = :pk AND begins_with(SK, 'PROJECT#')
		// FilterExpression: attribute_not_exists(deletedAt) - ALWAYS exclude soft-deleted items
		const pk = `USER#${userId}`;
		return this.dbProjects
			.filter((p) => p.PK === pk && p.SK.startsWith("PROJECT#"))
			.filter((p) => !p.deleted_at) // Exclude soft-deleted projects
			.map((dbProject) => this.mapper.toDomain(dbProject));
	}

	async getById(projectId: string, userId: string): Promise<Project | null> {
		// Docs: PK = USER#userId AND SK = PROJECT#projectId
		// TODO: DynamoDB GetItem with PK and SK
		const pk = `USER#${userId}`;
		const sk = `PROJECT#${projectId}`;

		const dbProject = this.dbProjects.find(
			(p) => p.PK === pk && p.SK === sk && !p.deleted_at,
		);

		return dbProject ? this.mapper.toDomain(dbProject) : null;
	}

	async create(
		data: Omit<Project, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Project> {
		// Generate unique ID and timestamps
		const projectId = randomUUID();
		const now = new Date();

		// Build complete Project domain entity
		const project: Project = {
			id: projectId,
			userId: data.userId,
			name: data.name,
			description: data.description,
			deletedAt: undefined,
			createdAt: now,
			updatedAt: now,
		};

		// Convert to DynamoDB entity using mapper
		const dbEntity = this.mapper.toDatabase(project);

		// TODO: Replace with DynamoDB PutItem
		// await this.dynamoClient.put({
		//   TableName: this.tableName,
		//   Item: dbEntity,
		// });

		// Temporary: Add to in-memory array
		this.dbProjects.push(dbEntity);

		return project;
	}
}
