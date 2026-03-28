import type { ProjectSummary } from "../entities";

export interface GetProjectsSummaryResponse {
	projects: ProjectSummary[];
}

export type { ProjectSummary };
