import { Project } from "@repo/contracts/projects/entities";

export type GetAllProjectsByUserInputService = {
	userId: string;
};

export interface GetAllProjectsByUserOutputService {
	projects: Project[];
}
