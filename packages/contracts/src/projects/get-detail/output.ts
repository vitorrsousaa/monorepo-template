import type { SectionsWithTasks } from "../../sections/entities";
import type { ProjectSummary } from "../entities";

interface GetProjectDetailResponse {
	project: ProjectSummary;
	sections: SectionsWithTasks[];
}

export type { GetProjectDetailResponse };
