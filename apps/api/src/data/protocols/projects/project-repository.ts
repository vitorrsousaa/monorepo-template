import type { Project } from "@core/domain/project/project";

export interface IProjectRepository {
	getAllProjectsByUser(userId: string): Promise<Project[]>;
	create(
		data: Omit<Project, "id" | "createdAt" | "updatedAt" | "deletedAt">,
	): Promise<Project>;
}
