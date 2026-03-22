import type { SectionsWithTasks } from "../../sections/entities";
import type { Project } from "../entities";

interface GetProjectDetailResponse {
	project: Project;
	sections: SectionsWithTasks[];
}

export type { GetProjectDetailResponse };
