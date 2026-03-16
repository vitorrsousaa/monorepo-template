import type { ProjectMapper } from "@data/protocols/projects/project-mapper";
import type { IProjectRepository } from "@data/protocols/projects/project-repository";
import type { ProjectDynamoDBEntity } from "@infra/db/dynamodb/mappers/projects/types";
import { Project } from "@repo/contracts/projects";
import { randomUUID } from "node:crypto";
import { IDatabaseClient } from "../../contracts/client";
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
 * For now, keeps data in memory for development (see project-dynamo-repository-mocks.ts).
 */
export class ProjectDynamoRepository implements IProjectRepository {
	private dbProjects: ProjectDynamoDBEntity[] = [...PROJECT_DYNAMO_MOCKS];

	constructor(private readonly dynamoClient: IDatabaseClient,private readonly mapper: ProjectMapper<ProjectDynamoDBEntity>) {}

	async getAllProjectsByUser(userId: string): Promise<Project[]> {
		// Docs: Use GSI6 (ProjectNameIndex) for alphabetical ordering by name
		// Real DynamoDB Query:
		// IndexName: 'GSI6-ProjectNameIndex'
		// KeyConditionExpression: GSI6PK = :gsi6pk AND begins_with(GSI6SK, 'PROJECT#')
		// FilterExpression: attribute_not_exists(deleted_at)

		const gsi6pk = `USER#${userId}`;

		// Simulating GSI6 query (ordered by name via GSI6SK)
		return this.dbProjects
			.filter((p) => p.GSI6PK === gsi6pk && p.GSI6SK?.startsWith("PROJECT#"))
			.filter((p) => !p.deleted_at) // Exclude soft-deleted projects
			.sort((a, b) => {
				// GSI6SK format: PROJECT#name#projectId
				// Sorting by GSI6SK gives alphabetical order by name
				const nameA = a.GSI6SK || "";
				const nameB = b.GSI6SK || "";
				return nameA.localeCompare(nameB);
			})
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
