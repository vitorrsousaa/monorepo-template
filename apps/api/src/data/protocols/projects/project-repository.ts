import type { Project } from "@core/domain/project/project";

export interface ProjectRepository {
  getAllProjectsByUser(userId: string): Promise<Project[]>;
}
