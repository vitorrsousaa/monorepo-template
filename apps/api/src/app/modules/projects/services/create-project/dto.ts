import type { Project } from "@repo/contracts/projects";
import type { CreateProjectInput } from "@repo/contracts/projects/create";

export interface CreateProjectInputService extends CreateProjectInput {
	userId: string;
}

export interface CreateProjectOutputService {
	project: Project;
}
